import AuthSvc from './authservice'

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

export default class UserCompetitionService {
    getUserLikes(userId, dataHandler, errHandler) {
        dataHandler({
            userId: userId,
            competitionStatus: "King",
            numberOfLikes: 100500,
            objectiveStars: []
        });
    }
}
