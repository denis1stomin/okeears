// Global application configuration file
window.AppConfig = {
    services: {
        uris: {
            general: 'http://d319b4af8ad541c48b45ff6c3872b0d3.westeurope.azurecontainer.io:8001',
            subjectservice: null,
            okrservice: null,
            auditservice: null,
            medalservice: null
        }
    },

    auth: {
        clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2',
        //loginResource: 'application id endpoint',
        //cacheLocation: 'localStorage',
        //redirectUri: 'https://okr.idioma.club/signin',
        //endpoints: [
        //    'https://graph.microsoft.com/v1.0/me',
        //    'https://graph.microsoft.com/v1.0/users',
        //    'https://graph.microsoft.com/v1.0/onenote'
        //]
        //
        graphResource: 'https://graph.microsoft.com'
    }
};