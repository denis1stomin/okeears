import AuthSvc from './authservice';

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

const NOTEBOOK_NAME = 'Okeears';

const SCOPE_STORAGE_KEY = 'last_selected_scope';

// In the future scopes can be modified by user, their names become editable
const SCOPES = [
    { id: 'FY2019',     name: 'Objectives for 2019' },
    { id: 'FY2018',     name: 'Objectives for 2018' },
    { id: 'PLAYGROUND', name: 'Playground' }
];

export default class OkrService {
    constructor() {

        let scopeId = localStorage.getItem(SCOPE_STORAGE_KEY);
        this.scope = scopeId ? this.getScopes().find(each => each.id == scopeId) : this.getScopes()[0];

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

    getSectionName() {
        return this.scope.id;
    }

    getScope() {
        return this.scope;
    }

    getScopes() {
        return SCOPES;
    }

    changeScope(scope) {
        localStorage.setItem(SCOPE_STORAGE_KEY, scope.id);
        this.scope = scope;
        
        // Section IDs cache is scope-specific, so need to reset cache on scope change
        this.sectionIds.clear();
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
                    percent: parseInt(cells[1] ? cells[1].innerText : "0", 10),
                    description: cells[2] ? cells[2].innerText : ""
                }
            });
            dataHandler(results);
        }, errHandler);
    }

    getObjectives(subjectId, userId, dataHandler, errHandler) {
        const readonlyMode = subjectId != userId;
        this.getSection(subjectId, readonlyMode, sectionId => {
            
            // User has not created any objectives yet
            if(!sectionId) {
                dataHandler([]);
                return;
            }

            this.graphClient
                .api(`${this.getSubjectPrefix(subjectId)}/onenote/sections/${sectionId}/pages`)
                .select('id, title, createdDateTime, lastModifiedDateTime, links')
                .orderby('createdDateTime asc')
                .get()
                .then(body => {
                    const objectives = body.value.map(page => {
                        const objective = {
                            id: page.id,
                            createdDateTime: page.createdDateTime,
                            lastModifiedDateTime: page.lastModifiedDateTime,
                            statement: page.title,
                            keyresults: [],
                            onenoteWebUrl: page.links.oneNoteWebUrl.href
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
        const title = objective.statement || '';
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
                    objective.createdDateTime = body.createdDateTime;
                    objective.lastModifiedDateTime = body.lastModifiedDateTime;
                    objective.onenoteWebUrl = body.links.oneNoteWebUrl.href;

                    if (objective.keyresults && objective.keyresults.length > 0) {
                        // TODO : we should avoid using timers
                        //        Need to use repeatable wait-getter function
                        setTimeout(() => {
                            this.changeObjective(subjectId, objective, dataHandler, errHandler);
                        }, 2000);
                    }
                    else {
                        dataHandler(objective);
                    }
                })
                .catch(errHandler);
        }, errHandler);
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {

        // TODO: Escape HTML in objective's statement
        const statement = objective.statement;

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
                content +=
                    `<tr data-id="${each.id}">
                        <td>${each.statement}</td>
                        <td>${each.percent}</td>
                        <td>${each.description || ""}</td>
                    </tr>`;
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
        const createSectionHandler = (notebookId) => {
            this.graphClient
                .api(`me/onenote/notebooks/${notebookId}/sections`)
                .post({ displayName: this.getSectionName() })
                .then((body) => {
                    let sectionId = body.id;
                    this.setSubjectSectionId(subjectId, sectionId);
                    this.shareNotebook(notebookId, errHandler);
                    dataHandler(sectionId);
                })
                .catch(errHandler);
        };

        this.graphClient
            .api('me/onenote/notebooks')
            .post({ displayName: NOTEBOOK_NAME })
            .then((body) => {
                const notebookId = body.id;
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
                            const notebooks = body.value;
                            if (notebooks.length == 1) {
                                const notebookId = notebooks[0].id;
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

    shareNotebook(notebookId, errHandler) {
        const oneDriveETag = notebookId.substr(2);
        const oneDriveSearchUrl = `me/drive/root/search(q='{${oneDriveETag}}')`;
        this.graphClient
            .api(oneDriveSearchUrl)
            .get()
            .then(data => {
                if(data.value.length > 0) {
                    this.shareOneDriveItem(data.value[0].id, errHandler);
                }
            })
            .catch(errHandler);
    }

    shareOneDriveItem(itemId, errHandler, aliasIndex = 0) {

        // From https://github.com/SharePoint/PnP-Sites-Core/blob/master/Core/OfficeDevPnP.Core/Extensions/SecurityExtensions.cs#L171
        const aliases = [
            "Everyone except external users",
            "Все, кроме внешних пользователей",
            "Jeder, außer externen Benutzern",
            "Tout le monde sauf les utilisateurs externes",
            "除外部用户外的任何人",
            "外部使用者以外的所有人",
        ];

        if(aliasIndex >= aliases.length) {
            // We have tried all the known aliases but still no luck :(
            return;
        }

        const body = {
            "recipients": [
                {
                    "alias": aliases[aliasIndex]
                }
            ],
            "requireSignIn": true,
            "sendInvitation": false,
            "roles": [ 
                "read"
            ]
        };
        
        this.graphClient
            .api(`me/drive/items/${itemId}/invite`)
            .post(body)
            .then(data => {})
            .catch(error => {
                // Most likely it is "The request is malformed or incorrect." 
                // due to wrong alias language or (probably?) already shared notebook.
                // TODO: Refactor this when OneNote API sharing functionality will be used.
                if(error.code == 'invalidRequest') {
                    this.shareOneDriveItem(itemId, errHandler, aliasIndex + 1);
                } else {
                    errHandler(error);
                }
            });        
    }

    getSection(subjectId, readonlyMode, dataHandler, errHandler) {
        const cachedSectionId = this.sectionIds.get(subjectId);
        if(cachedSectionId) {
            dataHandler(cachedSectionId);
            return;
        }

        this.searchForSection(subjectId, (sectionId, notebookId) => {
            if (sectionId) {
                dataHandler(sectionId);
                if(!readonlyMode && notebookId) {
                    // Ensure that notebook is shared.
                    // It is OK to share notebook several times
                    this.shareNotebook(notebookId, errHandler);
                }
            } else {
                if(!readonlyMode) {
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
                    const document = new DOMParser().parseFromString(body, 'text/html');
                    dataHandler(document);   
                } else {
                    // Chrome on Mac, probably something else
                    dataHandler(body);   
                }
            })
            .catch(errHandler);
    }

    searchForSection(subjectId, dataHandler, errHandler) {
        this.graphClient
            .api(`${this.getSubjectPrefix(subjectId)}/onenote/sections`)
            .filter(`displayName eq '${this.getSectionName()}'`)
            .select('id')
            .expand('parentNotebook')
            .get()
            .then((body) => {
                // Filter out sections from another notebooks, if any
                const sections = body.value.filter(section => section.parentNotebook.displayName == NOTEBOOK_NAME);
                if(sections.length == 1) {
                    const sectionId = sections[0].id;
                    const notebookId = sections[0].parentNotebook.id;
                    this.setSubjectSectionId(subjectId, sectionId);
                    dataHandler(sectionId, notebookId);
                } else if(sections.length == 0) {
                    dataHandler(null, null);
                } else {
                    errHandler({ message: `More than one '${this.getSectionName()}' sections found in the '${NOTEBOOK_NAME}' notebook.`});
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

    createId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
