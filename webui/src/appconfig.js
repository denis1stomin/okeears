// Global application configuration file
var AppConfig = {
    app: {
        services: {
            uris: {
                general: 'http://localhost:8001',
                subjectservice: '',
                okrservice: '',
                auditservice: '',
                medalservice: ''
            }
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
        //popUp: true
    }
};
