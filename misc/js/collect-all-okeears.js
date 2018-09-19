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

function getDelay() {
    return Math.floor((Math.random() * 10000) + 1000);
}

function getUserOkeears(userId, userName, cnt) {
    HttpClient
        .get(`users/${userId}/onenote/notebooks?$filter=displayName eq 'Okeears'&$select=id`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
        .then(resp => {
            if (resp.value && resp.value.length > 0) {
                console.log(userName);
            }
        })
        .catch(err => {
            //console.log('get okeears', err.response.status);
            if (err.response.status != 404) {
                cnt = cnt + 1;
                setTimeout(() => getUserOkeears(userId, userName, cnt + 1), 3000 * cnt);
            }
        });
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

        usersBunch.forEach(each => setTimeout(
            () => getUserOkeears(each.id, each.userPrincipalName, 1), getDelay()));

        handleNextUsersBunch(nextUsersUrl);
    })
    .catch(err => {
        console.log('get users', err);
        setTimeout(() => handleNextUsersBunch(usersUrl), 3000);
    });
};

console.log('Users which have Okeears file:');
handleNextUsersBunch('users');
