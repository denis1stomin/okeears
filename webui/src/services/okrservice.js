import axios from 'axios/index';
import auth from '../store/modules/auth';
const MicrosoftGraph = require('@microsoft/microsoft-graph-client');

export default class OkrService {
    constructor(config, tokenProvider) {
        this.graphClient = MicrosoftGraph.Client.init({
            debugLogging: true,
            authProvider: (done) => {
                auth.actions.WITH_TOKEN((token) => {
                    done(null, token);
                }, 'https://graph.microsoft.com');
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
        // let subjPath = subjectId ? `/subjects/${subjectId}` : '/me';
        
        let subjPath = '/me';
        this.graphClient
            .api(`${subjPath}/onenote/pages/1-732f7d64da614802bb5e17341fd4300e!8-597f81c9-9fac-4a01-937b-24649a2761a3/content`)
            .responseType('text')
            .get()
            .then((body) => {
                let htmlDoc = new DOMParser().parseFromString(body, "text/html");
                
                let htmlCollection = htmlDoc.getElementsByTagName('p');
                let nodes = Array.prototype.slice.call( htmlCollection );
                let objectives = nodes.map((each) => {
                    return {
                        id: 'uknown yet',
                        statement: each.innerText
                    };
                });
                
                dataHandler(objectives);
            })
            .catch(errHandler);
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
