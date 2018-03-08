/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const ConnectionHandler = require("../utilities/ConnectionHandler");

/**
 * @typedef {Object} UserObject
 * @property {string} name
 * @property {string} surname
 * @property {string} email
 * @property {string} gsmNumber
 * @property {string} tcIdentificationNumber
 * @property {string} password
 * @property {string} birthDate YYYY-MM-DD
 * @property {string} motherMaidenName
 */

class Users extends ConnectionHandler {
    constructor(client) {
        if (!client) throw new Error("Non-client call");
        super({
            endpoint: (client.isSandbox ? "https://sandbox-api.ininal.com/v2/users/" : "https://api.ininal.com/v2/users/")
        });
        this.client = client;
    }

    createUser(/** @type {UserObject} */ {
        name,
        surname,
        email,
        gsmNumber,
        tcIdentificationNumber,
        password,
        birthDate,
        motherMaidenName
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!name || !surname || !email || !gsmNumber || !tcIdentificationNumber || !password || !birthDate || !motherMaidenName) throw new Error("One or more variables are missing.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("POST", "", _reqconfig, {name, surname, email, gsmNumber, tcIdentificationNumber, password, birthDate, motherMaidenName});
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * @private
     */
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

module.exports = Users;