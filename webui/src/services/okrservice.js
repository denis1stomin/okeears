import auth from '../store/modules/auth';

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

const PAGE_TITLE = 'Objectives_FY2018';
const OBJECTIVES_LIST_ID = 'objectives';
const PAGE_TEMPLATE = 
    `<html>
        <head>
            <title>${PAGE_TITLE}</title>
        </head>
        <body>
            <div>
                <ul data-id="${OBJECTIVES_LIST_ID}">
                    <li>My first objective</li>
                </ul>
            </div>
        </body>
    </html>`;

export default class OkrService {
    constructor(config, tokenProvider) {
        this.pageId = null;
        this.graphClient = MicrosoftGraph.Client.init({
            authProvider: (done) => {
                auth.actions.WITH_TOKEN((token) => {
                    done(null, token);
                }, ACCESS_TOKEN_RESOURCE);
            }
        });
    }

    getPageContent(subjectId, dataHandler, errHandler) {
        this.ensurePageIsCreated((pageId) => {
            //let subjPath = subjectId ? `/users/${subjectId}` : '/me';
            let subjPath = '/me';
            this.graphClient
                .api(`${subjPath}/onenote/pages/${pageId}/content`)
                .responseType('text')
                .query({"includeIDs":"true"})
                .get()
                .then((body) => {
                    let document = new DOMParser().parseFromString(body, "text/html");
                    dataHandler(document);
                })
                .catch(errHandler);
        }, errHandler);
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        this.getPageContent(subjectId, (document) => {
            let listItemsNodes = document.getElementsByTagName('li');
            let nodes = Array.prototype.slice.call( listItemsNodes );
            let objectives = nodes.map((each) => {
                let objective = {
                    id: each.getAttribute('data-id'),
                    statement: each.innerText
                };
                return objective;
            });
            
            dataHandler(objectives);
        }, errHandler);
    }

    createPage(dataHandler, errHandler) {
        this.graphClient
            .api('me/onenote/pages')
            .header("content-type", "text/html")
            .post(PAGE_TEMPLATE)
            .then((body) => {
                this.pageId = body.id;
                dataHandler(this.pageId);
            })
            .catch(errHandler);
    }

    ensurePageIsCreated(dataHandler, errHandler) {
        if(this.pageId) {
            dataHandler(this.pageId);
        }

        this.graphClient
            .api('me/onenote/pages')
            .filter(`title eq '${PAGE_TITLE}'`)
            .select('id')
            .get()
            .then((body) => {
                if(body.value.length > 0) {
                    this.pageId = body.value[0].id;
                    dataHandler(this.pageId);
                }
                else {
                    this.createPage(dataHandler, errHandler);
                }
            })
            .catch(errHandler);
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        // Very simple unique id generator
        objective.id = Math.random().toString(36).substr(2, 9);
        let body = [
            {
              'target': `#${OBJECTIVES_LIST_ID}`,
              'action': 'append',
              // TODO: Escape HTML in objective's statement
              'content': `<li data-id="${objective.id}">${objective.statement}</li>`
            }];
        this.graphClient
            .api(`me/onenote/pages/${this.pageId}/content`)
            .patch(body)
            .then((body) => dataHandler(objective))
            .catch(errHandler);        
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
        let objectiveId = objective.id;
        this.getPageContent(subjectId, (document) => {
            let listNodeId = document.querySelector(`li[data-id="${objectiveId}"]`).getAttribute('id');

            let patchBody = [
                {
                'target': `${listNodeId}`,
                'action': 'replace',
                // TODO: Escape HTML in objective's statement
                'content': `<li data-id="${objectiveId}">${objective.statement}</li>`
                }];
            this.graphClient
                .api(`me/onenote/pages/${this.pageId}/content`)
                .patch(patchBody)
                .then(dataHandler)
                .catch(errHandler); 
        }, errHandler);
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.getPageContent(subjectId, (document) => {
            let listNodeId = document.querySelector(`li[data-id="${objectiveId}"]`).getAttribute('id');

            let patchBody = [
                {
                'target': `${listNodeId}`,
                'action': 'replace',
                'content':'<li></li>'
                }];
            this.graphClient
                .api(`me/onenote/pages/${this.pageId}/content`)
                .patch(patchBody)
                .then(successHandler)
                .catch(errHandler); 
        }, errHandler);
    }

    getObjectiveKeyResults(subjectId, objectiveId, dataHandler, errHandler) {
        // this.httpClient
        //     .get(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`)
        //     .then(resp => dataHandler(resp.data))
        //     .catch(err => errHandler(err));
    }

    putObjectiveKeyResults(subjectId, objectiveId, keyResultsObj, dataHandler, errHandler) {
        // this.httpClient
        //     .put(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`, keyResultsObj)
        //     .then(resp => dataHandler(resp.data))
        //     .catch(err => errHandler(err));
    }
}
