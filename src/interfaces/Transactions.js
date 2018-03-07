/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const ConnectionHandler = require("../utilities/ConnectionHandler");

class Transactions extends ConnectionHandler {
    constructor(client) {
        if (!client) throw new Error("Non-client call");
        super({
            endpoint: (client.isSandbox ? "https://sandbox-api.ininal.com/v2/transactions/" : "https://api.ininal.com/v2/transactions/")
        });
        this.client = client;
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

module.exports = Transactions;