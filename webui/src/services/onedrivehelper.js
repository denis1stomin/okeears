export default class OneDriveHelper {
    constructor(graphClient) {
        // From https://github.com/SharePoint/PnP-Sites-Core/blob/master/Core/OfficeDevPnP.Core/Extensions/SecurityExtensions.cs#L171
        this.Aliases = [
            "Everyone except external users",
            "Все, кроме внешних пользователей",
            "Jeder, außer externen Benutzern",
            "Tout le monde sauf les utilisateurs externes",
            "除外部用户外的任何人",
            "外部使用者以外的所有人",
        ];

        this.graphClient = graphClient;
    }

    getOneDriveItemIdByEtag(oneDriveETag, resultHandler, errHandler) {
        const oneDriveSearchUrl = `me/drive/root/search(q='{${oneDriveETag}}')`;
        this.graphClient
            .api(oneDriveSearchUrl)
            .get()
            .then(data => {
                if(data.value.length > 0) {
                    resultHandler(data.value[0].id);
                } else {
                    resultHandler(null);
                }
            })
            .catch(errHandler);
    }

    shareOneDriveItem(itemId, errHandler, aliasIndex = 0) {
        if(aliasIndex >= this.Aliases.length) {
            // We have tried all the known aliases but still no luck :(
            return;
        }

        const body = {
            "recipients": [
                {
                    "alias": this.Aliases[aliasIndex]
                }
            ],
            "requireSignIn": true,
            "sendInvitation": false,
            "roles": [ 
                "read"
            ]
        };
        
        this.graphClient
            .api(`me/drive/items/${itemId}/invite`)
            .post(body)
            .then(data => {})
            .catch(error => {
                // Most likely it is "The request is malformed or incorrect." 
                // due to wrong alias language or (probably?) already shared notebook.
                if(error.code == 'invalidRequest') {
                    this.shareOneDriveItem(itemId, errHandler, aliasIndex + 1);
                } else {
                    errHandler(error);
                }
            });
    }

    checkOneDriveItemIsShared(itemId, resultHandler, errHandler) {
        this.graphClient
            .api(`me/drive/items/${itemId}`)
            .get()
            .then(data => {
                const linkReg = new RegExp('(https://.+/)_layouts/.+');
                resultHandler({
                    isShared: data.hasOwnProperty('shared'),
                    webUrl: linkReg.exec(data.webUrl)[1]
                });
            })
            .catch(errHandler);
    }
}
