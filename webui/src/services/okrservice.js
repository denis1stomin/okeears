import AuthSvc from './authservice';

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

const NOTEBOOK_NAME = 'Okeears';
const SECTION_NAME = 'Objectives';

export default class OkrService {
    constructor() {
        
        // Stores mapping from user id to his objective's page id
        this.pageIds = new Map();
        
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

    loadKeyResults(objectiveId, dataHandler, errHandler) {
        this.getPageContent(objectiveId, document => {
            const listNode = document.querySelector(`div > ul`);
            if(!listNode) {
                return dataHandler([]);
            }

            const nodes = Array.from(listNode.querySelectorAll('li'));
            const results = nodes.map(each => {
                return {
                    statement: each.innerText
                }
            });
            dataHandler(results);
        }, errHandler);
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        this.getSection(subjectId, false, sectionId => {
            if(sectionId) {
                this.graphClient
                    .api(`${this.getSubjectPrefix(subjectId)}/onenote/sections/${sectionId}/pages`)
                    .get()
                    .then(body => {
                        const objectives = body.value.map(page => {
                            const pageId = page.id;
                            const objective = {
                                id: pageId,
                                statement: page.title,
                                keyresults: []
                            };

                            this.loadKeyResults(objective.id, data => {
                                objective.keyresults = data;
                            }, errHandler);

                            return objective;
                        });
                        dataHandler(objectives);
                    })
                    .catch(errHandler);
            } else {
                dataHandler([]);
            }
        }, errHandler);

        // this.getPageContent(subjectId, allowPageCreation, (document) => {
            
        //     // There are no objectives created yet
        //     if(!document) {
        //         return dataHandler([]);
        //     }

        //     let objectivesNode = document.querySelector(`div > ul`);
        //     if(!objectivesNode) {
        //         return dataHandler([]);
        //     }

        //     let nodes = Array.from(objectivesNode.querySelectorAll('li[data-id]'));
        //     let objectives = nodes.map(each => {
        //         let resultNodes = Array.from(each.querySelectorAll('li'));
        //         const keyResults = resultNodes.map(each => {
        //             return {
        //                 statement: each.innerText
        //             }
        //         });

        //         let paragraphNode = each.querySelector('p');
        //         let statement = paragraphNode ? paragraphNode.innerText : each.innerText;
        //         return {
        //             id: each.getAttribute('data-id'),
        //             statement: statement,
        //             keyresults: keyResults
        //         };
        //     });
            
        //     dataHandler(objectives);
        // }, errHandler);
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        const title = objective.statement;
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

        // // Very simple unique id generator
        // objective.id = Math.random().toString(36).substr(2, 9);
        
        // // TODO: Escape HTML in objective's statement
        // let statement = objective.statement;

        // this.getPageContent(subjectId, true, (document) => {

        //     // If undefined - this is the first objective, 
        //     // need to add both ul and li tags
        //     let objectivesNode = document.querySelector(`div > ul`);
        //     let patchBody = objectivesNode ? 
        //         [{
        //               'target': `${objectivesNode.getAttribute('id')}`,
        //               'action': 'append',
        //               'content': `<li data-id="${objective.id}"><p>${statement}</p></li>`
        //         }] : 
        //         [{
        //             // In OneNote the 'body' target means the first div on page
        //             'target': `body`,
        //             'action': 'append',
        //             'content': `<ul><li data-id="${objective.id}"><p>${statement}</p></li></ul>`
        //         }];

        //     this.graphClient
        //         .api(this.getSubjectPageContentUrl(subjectId))
        //         .patch(patchBody)
        //         .then((body) => dataHandler(objective))
        //         .catch(errHandler);
        // }, errHandler);
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
        let objectiveId = objective.id;
        
        // TODO: Escape HTML in objective's statement
        let statement = objective.statement;

        this.getPageContent(objectiveId, document => {
            const patchBody = 
            [{
                'target': 'title',
                'action': 'replace',
                'content': statement
            }];

            this.graphClient
                .api(`me/onenote/pages/${objectiveId}/content`)
                .patch(patchBody)
                .then(dataHandler)
                .catch(errHandler); 

            // // Change operations should reference items by unique id generated by OneNote,
            // // referencing by data-id is not supported
            // const objectiveNode = document.querySelector(`li[data-id="${objectiveId}"]`);
            // const objectiveNodeId =  objectiveNode.getAttribute('id');

            // let keyResultsContent = '';
            // if(objective.keyresults && objective.keyresults.length > 0) {
            //     let itemsContent = '';
            //     objective.keyresults.forEach(each => {
            //         itemsContent += `<li>${each.statement}</li>`;
            //     });
            //     keyResultsContent = `<ul>${itemsContent}</ul>`;
            // }

            // // New content we want to save
            // const content = `<li data-id="${objectiveId}"><p>${statement}</p>${keyResultsContent}</li>`;
            
            // // This is absolutely crazy OneNote behavior :(
            // // It seems it does not support replacing the whole node (ul, li etc.) with the new content.
            // // Instead it copies old content outside the target node, and only then replaces node's content.
            // // So we need to remove (replace with empty nodes) all the existing content recursively, and then add new content.
            // let patchBody = [];

            // const existingKeyResultsNode = objectiveNode.querySelector('ul');
            // if(existingKeyResultsNode) {
            //     // Remove existing key results nodes, if any
            //     const existingKeyResultNodes = existingKeyResultsNode.querySelectorAll('li');
            //     Array.from(existingKeyResultNodes).forEach(each => {
            //         patchBody.push(
            //             {
            //                 'target': `${each.getAttribute('id')}`,
            //                 'action': 'replace',
            //                 'content': '<li></li>'
            //             });
            //     });

            //     // Remove existing key result list node
            //     patchBody.push(
            //     {
            //         'target': `${existingKeyResultsNode.getAttribute('id')}`,
            //         'action': 'replace',
            //         'content': '<ul></ul>'
            //     });
            // }

            // patchBody.push(
            //     {
            //         'target': `${objectiveNodeId}`,
            //         'action': 'replace',
            //         'content': content
            //     }
            // );
            
            // this.graphClient
            //     .api(this.getSubjectPageContentUrl(subjectId))
            //     .patch(patchBody)
            //     .then(dataHandler)
            //     .catch(errHandler); 
        }, errHandler);
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.graphClient
            .api(`me/onenote/pages/${objectiveId}`)
            .delete()
            .then(successHandler)
            .catch(errHandler);

        // this.getPageContent(subjectId, false, (document) => {

        //     if(!document) {
        //         return errHandler({message: "Cannot found Objective's OneNote page."});
        //     }

        //     let listNodeId = document.querySelector(`li[data-id="${objectiveId}"]`).getAttribute('id');

        //     // OneNote does not support explicit delete operation, so patching with 
        //     // the empty item - it will be completely removed in OneNote page
        //     let patchBody = [
        //         {
        //         'target': `${listNodeId}`,
        //         'action': 'replace',
        //         'content':'<li></li>'
        //         }];
        //     this.graphClient
        //         .api(this.getSubjectPageContentUrl(subjectId))
        //         .patch(patchBody)
        //         .then(successHandler)
        //         .catch(errHandler); 
        // }, errHandler);
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

    getPageContent(pageId, dataHandler, errHandler) {
        this.graphClient
            .api(`me/onenote/pages/${pageId}/content`)
            .responseType('document')
            .query({'includeIDs':'true'})
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
}
