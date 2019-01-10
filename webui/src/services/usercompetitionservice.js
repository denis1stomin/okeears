import AuthSvc from './authservice'

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

export default class UserCompetitionService {
    getUserLikes(userId, dataHandler, errHandler) {

        // first 24 symbols of md5 of okeears<GUID WITHOUT DASHES>
        // test storage eacf83e7724ad1dc0ecc42eb

        dataHandler({
            userId: userId,
            competitionStatus: "King",
            numberOfLikes: 8,
            objectiveStars: []
        });
    }
}
