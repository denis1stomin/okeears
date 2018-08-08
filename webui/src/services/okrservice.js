import AuthSvc from './authservice';

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

const NOTEBOOK_NAME = 'Okeears';
const SECTION_NAME = 'FY2018';

export default class OkrService {
    constructor() {
        
        // Stores mapping from user id to his notebook section with objectives-pages
        this.sectionIds = new Map();

        this.graphClient = MicrosoftGraph.Client.init({
            //debugLogging: true,
            authProvider: (done) => {
                AuthSvc.withToken((token) => {
                    done(null, token);
                }, ACCESS_TOKEN_RESOURCE);
            }
        });
    }

    getKeyResults(subjectId, objectiveId, dataHandler, errHandler) {
        this.getPageContent(subjectId, objectiveId, document => {

            const table = document.querySelector('div > table');
            if(!table) {
                return dataHandler([]);
            }
            
            const rows = Array.from(table.querySelectorAll('tr'));
            const results = rows.map(each => {
                const rowId = each.getAttribute('data-id');
                const id = rowId ? rowId : this.createId(); 
                
                const cells = Array.from(each.querySelectorAll('td'));
                return {
                    id: id,
                    statement: cells[0].innerText,
                    percent: parseInt(cells[1].innerText, 10)
                }
            });
            dataHandler(results);
        }, errHandler);
    }

    getObjectives(subjectId, userId, dataHandler, errHandler) {
        const createSection = subjectId == userId;
        this.getSection(subjectId, createSection, sectionId => {
            
            // User has not created any objectives yet
            if(!sectionId) {
                dataHandler([]);
                return;
            }

            this.graphClient
                .api(`${this.getSubjectPrefix(subjectId)}/onenote/sections/${sectionId}/pages`)
                .select('id, title')
                .orderby('createdDateTime asc')
                .get()
                .then(body => {
                    const objectives = body.value.map(page => {
                        const objective = {
                            id: page.id,
                            statement: page.title,
                            keyresults: []
                        };

                        this.getKeyResults(subjectId, objective.id, data => {
                            objective.keyresults = data;
                        }, errHandler);

                        return objective;
                    });
                    dataHandler(objectives);
                })
                .catch(errHandler);
        
        }, errHandler);
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        const title = objective.statement ? objective.statement : '';
        const page = 
            `<html>
                <head>
                    <title>${title}</title>
                </head>
                <body>
                    <div>
                    </div>
                </body>
            </html>`;

        this.getSection(subjectId, true, sectionId => {
            this.graphClient
                .api(`me/onenote/sections/${sectionId}/pages`)
                .header("Content-Type", "application/xhtml+xml")
                .post(page)
                .then(body => {
                    objective.id = body.id;
                    dataHandler(objective);
                })
                .catch(errHandler);
        }, errHandler);
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
       
        // TODO: Escape HTML in objective's statement
        let statement = objective.statement;

        const patchBody = 
        [{
            'target': 'title',
            'action': 'replace',
            'content': statement
        }];
        
        let content = '';
        if(objective.keyresults && objective.keyresults.length > 0) {
            objective.keyresults.forEach(each => {
                if(!each.id) {
                    each.id = this.createId();
                }
                if(!each.percent) {
                    each.percent = 0;
                }
                content += `<tr data-id="${each.id}"><td>${each.statement}</td><td>${each.percent}</td></tr>`;
            });
        }

        patchBody.push(
        {
            'target': 'body',
            'action': 'replace',
            'content': `<table>${content}</table>`
        });   

        this.graphClient
            .api(`me/onenote/pages/${objective.id}/content`)
            .patch(patchBody)
            .then(dataHandler)
            .catch(errHandler); 
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.graphClient
            .api(`me/onenote/pages/${objectiveId}`)
            .delete()
            .then(successHandler)
            .catch(errHandler);
    }

    createSection(subjectId, dataHandler, errHandler) {
        const createSectionHandler = notebookId => {
            this.graphClient
                .api(`me/onenote/notebooks/${notebookId}/sections`)
                .post({ displayName: SECTION_NAME })
                .then((body) => {
                    let sectionId = body.id;
                    this.setSubjectSectionId(subjectId, sectionId);
                    this.shareNotebook(errHandler);
                    dataHandler(sectionId);
                })
                .catch(errHandler);
        };

        this.graphClient
            .api('me/onenote/notebooks')
            .post({ displayName: NOTEBOOK_NAME })
            .then((body) => {
                let notebookId = body.id;
                createSectionHandler(notebookId);
            })
            .catch(error => {
                // An item with this name already exists in this location.
                if(error.code == 20117) {
                    this.graphClient
                        .api('me/onenote/notebooks')
                        .filter(`displayName eq '${NOTEBOOK_NAME}'`)
                        .select('id')
                        .get()
                        .then((body) => {
                            let notebooks = body.value;
                            if(notebooks.length == 1) {
                                let notebookId = notebooks[0].id;
                                createSectionHandler(notebookId);
                            } else {
                                errHandler({ message: `Cannot find and/or create the '${NOTEBOOK_NAME}' notebook.`});
                            }
                        })
                        .catch(errHandler);
                } else {
                    errHandler(error);
                }
            });
    }

    shareNotebook(errHandler) {
        const body = {
            "recipients": [
                {
                    "alias": "Everyone except external users"
                }
            ],
            "requireSignIn": true,
            "sendInvitation": false,
            "roles": [ 
                "read"
            ]
        };
        const url = `me/drive/root:/Notebooks/${NOTEBOOK_NAME}:/invite`;
        this.graphClient
            .api(url)
            .post(body)
            .then(data => {})
            .catch(errHandler); 
    }

    getSection(subjectId, createSection, dataHandler, errHandler) {
        this.searchForSection(subjectId, sectionId => {
            if(sectionId) {
                dataHandler(sectionId);
            } else {
                if(createSection) {
                    this.createSection(subjectId, dataHandler, errHandler);
                } else {
                    dataHandler(null);
                }
            }
        }, errHandler);
    }

    getPageContent(subjectId, pageId, dataHandler, errHandler) {
        this.graphClient
            .api(`${this.getSubjectPrefix(subjectId)}/onenote/pages/${pageId}/content`)
            .responseType('document')
            .get()
            .then((body) => {
                if(ArrayBuffer.isView(body)) {
                    // Chrome, Edge on Windows
                    let document = new DOMParser().parseFromString(body, 'text/html');
                    dataHandler(document);   
                } else {
                    // Chrome on Mac, probably something else
                    dataHandler(body);   
                }
            })
            .catch(errHandler);
    }

    searchForSection(subjectId, dataHandler, errHandler) {
        let sectionId = this.getSubjectSectionId(subjectId);
        if(sectionId) {
            dataHandler(sectionId);
            return;
        }

        this.graphClient
            .api(`${this.getSubjectPrefix(subjectId)}/onenote/sections`)
            .filter(`displayName eq '${SECTION_NAME}'`)
            .select('id')
            .expand('parentNotebook')
            .get()
            .then((body) => {
                // Filter out sections from another notebooks, if any
                let sections = body.value.filter(section => section.parentNotebook.displayName == NOTEBOOK_NAME);
                if(sections.length == 1) {
                    let sectionId = sections[0].id;
                    this.setSubjectSectionId(subjectId, sectionId);
                    dataHandler(sectionId);
                } else if(sections.length == 0) {
                    dataHandler(null);
                } else {
                    errHandler({ message: `More than one '${SECTION_NAME}' sections found in the '${NOTEBOOK_NAME}' notebook.`});
                }
            })
            .catch(errHandler);
    }

    getSubjectPrefix(subjectId) {
        return `/users/${subjectId}`;
    }

    setSubjectSectionId(subjectId, sectionId) {
        this.sectionIds.set(subjectId, sectionId);
    }

    getSubjectSectionId(subjectId)
    {
        return this.sectionIds.get(subjectId);
    }

    createId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
