/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const ConnectionHandler = require("../utilities/ConnectionHandler");

class Authentication extends ConnectionHandler {
    constructor(client) {
        if (!client) throw new Error("Non-client call");
        super({
            endpoint: (client.isSandbox ? "https://sandbox-api.ininal.com/v2/" : "https://api.ininal.com/v2/")
        });
        this.client = client;
        this._reqconfig = {
            authType: "basic",
            api_key: this.client.api_key,
            secret_key: this.client.secret_key
        }; 
    }

    authenticate() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.client.isAuthenticated()) return resolve(true);
                var req = await this.sendRequest("POST", "/oauth/accesstoken", this._reqconfig);
                this.client.accessToken = req.accessToken;
                this.client.tokenExpiresAt = (Date.now() + parseInt(req.expiresIn));
                return resolve(req);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = Authentication;
