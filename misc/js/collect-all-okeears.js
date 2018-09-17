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

function handleNextUsersBunch(usersUrl) {
    HttpClient.get(usersUrl, {
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
    })
    .then(resp => {
        const usersBunch = resp.data['value'];
        const nextUsersUrl = resp.data['@odata.nextLink'];

        usersBunch.forEach(each => {
            HttpClient
                .get(`users/${each.id}/onenote/notebooks?$filter=displayName eq 'Okeears'&$select=id`, {
                    headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`
                    }
                })
                .then(resp => {
                    if (resp.value && resp.value.length > 0) {
                        console.log(each.userPrincipalName);
                    }
                })
                .catch(err => {
                    console.log(err);
                    if (err.statusCode != 404 && err.statusCode != 429) {
                        //console.log('get notebook', err);
                    }
                });

            //await sleep(50);
        });

        //handleNextUsersBunch(nextUsersUrl);
        setTimeout(() => handleNextUsersBunch(nextUsersUrl), 100);
    })
    .catch(err => {
        //console.log('get users', err);
    });
};

console.log('Users which have Okeears file:');
handleNextUsersBunch('users');
