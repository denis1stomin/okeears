import axios from 'axios/index';
import auth from '../store/modules/auth';

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');

const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';
const PAGE_TITLE = 'Objectives_FY2018';
const PAGE_TEMPLATE = 
    `<html>
        <head>
            <title>${PAGE_TITLE}</title>
        </head>
        <body>
            <div>
                <ul>
                    <li><p>Placeholder one</p></li>
                    <li><p>Placeholder two</p></li>
                </ul>
            </div>
        </body>
    </html>`;

export default class OkrService {
    constructor(config, tokenProvider) {

        this.pageId = null;
        this.graphClient = MicrosoftGraph.Client.init({
            // debugLogging: true,
            authProvider: (done) => {
                auth.actions.WITH_TOKEN((token) => {
                    done(null, token);
                }, ACCESS_TOKEN_RESOURCE);
            }
        });

        this.httpClient = axios.create({
            baseURL: config.services.uris.okrservice || config.services.uris.general || undefined,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        this.ensureObjectivesPageIsCreated((pageId) => {
            // let subjPath = subjectId ? `/subjects/${subjectId}` : '/me';
            let subjPath = '/me';
            this.graphClient
                .api(`${subjPath}/onenote/pages/${pageId}/content`)
                .responseType('text')
                .query({"includeIDs":"true"})
                .get()
                .then((body) => {
                    let htmlDoc = new DOMParser().parseFromString(body, "text/html");
                    
                    let htmlCollection = htmlDoc.getElementsByTagName('li');
                    let nodes = Array.prototype.slice.call( htmlCollection );
                    let objectives = nodes.map((each) => {
                        let objective = {
                            id: each.getAttribute('id'),
                            statement: each.innerText
                        };
                        return objective;
                    });
                    
                    dataHandler(objectives);
                })
                .catch(errHandler);
        }, errHandler);
    }

    createObjectivesPage(dataHandler, errHandler) {
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

    ensureObjectivesPageIsCreated(dataHandler, errHandler) {
        if(this.pageId) {
            dataHandler(this.pageId);
        }

        this.graphClient
            .api('me/onenote/pages')
            .filter(`title eq '${PAGE_TITLE}'`)
            .select('id')
            .get((err, body) => {
                if(body.value.length > 0) {
                    this.pageId = body.value[0].id;
                    dataHandler(this.pageId);
                }
                else {
                    this.createObjectivesPage(dataHandler, errHandler);
                }
            });
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        this.httpClient
            .post(`/subjects/${subjectId}/objectives`, objective)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
        objective.subjectId = subjectId;    // temp
        this.httpClient
            //.put(`/subjects/${subjectId}/objectives/${objective.id}`, objective)
            .put(`/objectives/${objective.id}`, objective)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.httpClient
            //.delete(`/subjects/${subjectId}/objectives/${objectiveId}`)
            .delete(`/objectives/${objectiveId}`)
            .then(resp => successHandler(resp))
            .catch(err => errHandler(err));
    }

    getObjectiveKeyResults(subjectId, objectiveId, dataHandler, errHandler) {
        this.httpClient
            .get(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    putObjectiveKeyResults(subjectId, objectiveId, keyResultsObj, dataHandler, errHandler) {
        this.httpClient
            .put(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`, keyResultsObj)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}
