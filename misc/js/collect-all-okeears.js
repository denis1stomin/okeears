const Axios = require('axios');
const HttpClient = Axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const ACCESS_TOKEN = process.env.MSGRAPH_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
    console.log('Provide environment variable MSGRAPH_ACCESS_TOKEN');
    process.exit(1);
}


HttpClient.get('me', {
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    })
    .then(resp => {
        const body = resp.data;
        console.log(body);
    })
    .catch(err => {
        console.log(err);
    });
