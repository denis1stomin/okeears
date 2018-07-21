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
            </div>
        </body>
    </html>`;

export default class OkrService {
    constructor(config, tokenProvider) {
        
        // Stores mapping from user id to his objective's page id
        this.pageIds = new Map();

        this.graphClient = MicrosoftGraph.Client.init({
            // debugLogging: true,
            authProvider: (done) => {
                auth.actions.WITH_TOKEN((token) => {
                    done(null, token);
                }, ACCESS_TOKEN_RESOURCE);
            }
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        this.getPageContent(subjectId, (document) => {
            let nodes = Array.from(document.querySelectorAll('li[data-id]'));
            let objectives = nodes.map((each) => {
                return {
                    id: each.getAttribute('data-id'),
                    // TODO: Probably this contains KRs text too - will see
                    statement: each.innerText
                };
            });
            
            dataHandler(objectives);
        }, errHandler);
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        
        // Very simple unique id generator
        objective.id = Math.random().toString(36).substr(2, 9);
        
        // TODO: Escape HTML in objective's statement
        let statement = objective.statement;

        this.getPageContent(subjectId, (document) => {

            // If undefined - this is the first objective, 
            // need to add both ul and li tags
            let objectivesNode = document.querySelector(`ul[data-id="${OBJECTIVES_LIST_ID}"]`);
            
            let patchBody = objectivesNode ? 
                [{
                      'target': `#${OBJECTIVES_LIST_ID}`,
                      'action': 'append',
                      'content': `<li data-id="${objective.id}">${statement}</li>`
                }] : 
                [{
                    // In OneNote body means the first div on page
                    'target': `body`,
                    'action': 'append',
                    'content': `<ul data-id="${OBJECTIVES_LIST_ID}"><li data-id="${objective.id}">${statement}</li></ul>`
                }];
                    
            this.graphClient
                .api(this.getSubjectPageContentUrl(subjectId))
                .patch(patchBody)
                .then((body) => dataHandler(objective))
                .catch(errHandler);
        }, errHandler);
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
        let objectiveId = objective.id;
        this.getPageContent(subjectId, (document) => {

            // Change operations should reference items by unique id generated by OneNote,
            // referencing by data-id is not supported
            let listNodeId = document.querySelector(`li[data-id="${objectiveId}"]`).getAttribute('id');

            let patchBody = [
                {
                'target': `${listNodeId}`,
                'action': 'replace',
                // TODO: Escape HTML in objective's statement
                'content': `<li data-id="${objectiveId}">${objective.statement}</li>`
                }];
            this.graphClient
                .api(this.getSubjectPageContentUrl(subjectId))
                .patch(patchBody)
                .then(dataHandler)
                .catch(errHandler); 
        }, errHandler);
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.getPageContent(subjectId, (document) => {
            let listNodeId = document.querySelector(`li[data-id="${objectiveId}"]`).getAttribute('id');

            // OneNote does not support explicit delete operation, so patching with 
            // the empty item - it will be completely removed in OneNote page
            let patchBody = [
                {
                'target': `${listNodeId}`,
                'action': 'replace',
                'content':'<li></li>'
                }];
            this.graphClient
                .api(this.getSubjectPageContentUrl(subjectId))
                .patch(patchBody)
                .then(successHandler)
                .catch(errHandler); 
        }, errHandler);
    }

    createPage(subjectId, dataHandler, errHandler) {
        this.graphClient
            .api(`${this.getSubjectPrefix(subjectId)}/onenote/pages`)
            .header("content-type", "text/html")
            .post(PAGE_TEMPLATE)
            .then((body) => {
                let pageId = body.id;
                this.setSubjectPageId(subjectId, pageId);
                dataHandler(pageId);
            })
            .catch(errHandler);
    }

    ensurePageIsCreated(subjectId, dataHandler, errHandler) {
        let pageId = this.getSubjectPageId(subjectId);
        if(pageId) {
            dataHandler(pageId);
        }

        this.graphClient
            .api(`${this.getSubjectPrefix(subjectId)}/onenote/pages`)
            // Searches for the page with specified title across all user's notebooks
            .filter(`title eq '${PAGE_TITLE}'`)
            .select('id')
            .get()
            .then((body) => {
                if(body.value.length > 0) {
                    let pageId = body.value[0].id;
                    this.setSubjectPageId(subjectId, pageId);
                    dataHandler(pageId);
                }
                else {
                    // TODO: We should not try to create pages for another users
                    this.createPage(subjectId, dataHandler, errHandler);
                }
            })
            .catch(errHandler);
    }

    getPageContent(subjectId, dataHandler, errHandler) {
        this.ensurePageIsCreated(subjectId, (pageId) => {
            
            this.graphClient
                .api(this.getSubjectPageContentUrl(subjectId))
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

    getSubjectPrefix(subjectId) {
        // return subjectId ? `/users/${subjectId}` : '/me';
        return `/users/${subjectId}`;
    }

    setSubjectPageId(subjectId, pageId) {
        this.pageIds.set(subjectId, pageId);
    }

    getSubjectPageId(subjectId)
    {
        return this.pageIds.get(subjectId);
    }

    getSubjectPageContentUrl(subjectId)
    {
        let prefix = this.getSubjectPrefix(subjectId);
        let pageId = this.getSubjectPageId(subjectId);
        return `${prefix}/onenote/pages/${pageId}/content`;
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
