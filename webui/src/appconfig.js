// Global application configuration file
window.AppConfig = {
    services: {
        uris: {
            // general: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.5.0',
            general: 'http://d319b4af8ad541c48b45ff6c3872b0d3.westeurope.azurecontainer.io:8001',
            subjectservice: null,
            okrservice: null,
            auditservice: null,
            medalservice: null
        }
    },

    auth: {
        clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2',
        loginResource: 'https://graph.microsoft.com'
        //cacheLocation: 'localStorage',
        //redirectUri: 'https://okr.idioma.club/signin',
        //redirectUri: 'http://localhost:8000/signin',
        //endpoints: [
        //    'https://graph.microsoft.com',
        //    'https://graph.microsoft.com/v1.0/me',
        //    'https://graph.microsoft.com/v1.0/users',
        //    'https://graph.microsoft.com/v1.0/onenote'
        //]
    }
};
