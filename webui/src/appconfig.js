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
        tenant: '57a18dd1-7522-4744-8df1-eda5260dc1e8',
        clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2',
        //redirectUri: 'https://okr.idioma.club/signin',
        endpoints: [
            'https://graph.microsoft.com/v1.0/me',
            'https://graph.microsoft.com/v1.0/users',
            'https://graph.microsoft.com/v1.0/onenote'
        ]
    }
};
