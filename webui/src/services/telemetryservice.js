export default class TelemetryService {
    constructor() {
    }

    setUser(user) {
        window.appInsights.setAuthenticatedUserContext(user.id);
        // this.sha256(user.id).then(digest => {
        //     window.appInsights.context.user.id = digest;
        // })
    }

    clearUser() {
        window.appInsights.clearAuthenticatedUserContext();
    }

    trackEvent(name, data) {
        window.appInsights.trackEvent(name, data);
    }

    // sha256(value) {
    //     let buffer = new TextEncoder("utf-8").encode(value);
    //     let telemetry = this;
    //     return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    //       return telemetry.hex(hash);
    //     });
    // }
      
    // hex(buffer) {
    //     let hexCodes = [];
    //     let view = new DataView(buffer);
    //     for (let i = 0; i < view.byteLength; i += 4) {
    //         let  value = view.getUint32(i)
    //         let stringValue = value.toString(16)
    //         let padding = '00000000'
    //         let paddedValue = (padding + stringValue).slice(-padding.length)
    //         hexCodes.push(paddedValue);
    //     }
    //     return hexCodes.join("");
    // }
}

