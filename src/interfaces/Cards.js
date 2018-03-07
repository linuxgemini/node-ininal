/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const ConnectionHandler = require("../utilities/ConnectionHandler");

class Cards extends ConnectionHandler {
    constructor(client) {
        if (!client) throw new Error("Non-client call");
        super({
            endpoint: (client.isSandbox ? "https://sandbox-api.ininal.com/v2/cards/" : "https://api.ininal.com/v2/cards/")
        });
        this.client = client;
    }

    getCardInfo(cardToken) {
        return new Promise(async (resolve, reject) => {
            try {
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("GET", `/${cardToken}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }
    
    _reqconfig() {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.client.isAuthenticated()) await this.client.authentication.authenticate();
                return resolve({
                    authType: "bearer",
                    bearerToken: this.client.accessToken
                }); 
            } catch (error) {
                return reject(error);
            }
        });
    }
}

module.exports = Cards;
