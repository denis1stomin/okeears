const Axios = require('axios');
const Azure = require('azure-storage');

const AppInsightsClient = Axios.create({
    baseURL: 'https://api.applicationinsights.io/v1',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const SlackClient = Axios.create({
    baseURL: 'https://hooks.slack.com/services',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const TABLE_STORAGE = 'okrdata';
const TABLE_NAME = 'users';
const TABLE_SECRET = process.env['TABLE_SECRET'];
const TableSvc = Azure.createTableService(TABLE_STORAGE, TABLE_SECRET);

const APP_ID = process.env['APP_ID'];
const API_SECRET = process.env['API_SECRET'];
const KQL_USERS_QUERY = 'customEvents | where timestamp > ago(70m) | summarize count() by user_AuthenticatedId | project user_AuthenticatedId;';

const WEBHOOK_PATH = process.env['WEBHOOK_PATH'];
const WEBHOOK_CHANNEL = process.env['WEBHOOK_CHANNEL'];

function getLastUsers(handler) {
    AppInsightsClient
        .get(`/apps/${APP_ID}/query?api_key=${API_SECRET}&query=${KQL_USERS_QUERY}`)
        .then(resp => {
            handler(resp.data.tables[0].rows);
        })
        .catch(err => {
            console.log('get last users', err.response.status);
        });
}

function rememberUser(userId) {
    const entity = {
        PartitionKey: {'_': 'id'},
        RowKey: {'_': userId.toString()}
    };

    TableSvc.insertEntity(TABLE_NAME, entity, (err, result, resp) => {
        if (err) {
            console.log(err);
        }
    });
}

function checkUser(userId, newUserHandler, onRequestDone) {
    TableSvc.retrieveEntity(TABLE_NAME, 'id', userId, (err, result, resp) => {
        if (err && (err.statusCode === 404)) {
            newUserHandler();
        }
        onRequestDone();
    });
}

function notifyAboutNewUsers(cnt, exit) {
    let msg = 'New unique user has joined \`Okeears\` in the last hour!';
    if (cnt > 1) {
        msg = `Wow! ${cnt} unique users have joined \`Okeears\` in the last hour!`;
    }

    SlackClient
        .post(WEBHOOK_PATH, {
            text: msg,
            username: "Okeears watcher",
            channel: WEBHOOK_CHANNEL
        })
        .then(resp => {
            exit();
        })
        .catch(err => {
            console.log('post slack', err.response.status);
            exit();
        });
}

module.exports = async function (context, myTimer) {

    getLastUsers(users => {
        console.log('here');
        let newUsersCnt = 0;
        let cnt = 0;
        const total = users.length;

        users.forEach(elem => {
            const userId = elem[0];

            checkUser(userId, () => {
                rememberUser(userId);
                newUsersCnt = newUsersCnt + 1;

            }, () => {
                cnt = cnt + 1;

                // send a notification after the last user
                if (total === cnt && newUsersCnt > 0) {
                    notifyAboutNewUsers(newUsersCnt, context.done);
                }
                else {
                    context.done();
                }
            });
        });
    });
};
