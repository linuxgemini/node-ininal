/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const Authentication = require("../interfaces/Authentication");
const Cards = require("../interfaces/Cards");
const Transactions = require("../interfaces/Transactions");
const Users = require("../interfaces/Users");

/**
 * @typedef {Object} ClientOptions
 * @property {string} api_key
 * @property {string} secret_key
 * @property {boolean} [isSandbox = false]
 */

class Client {
    constructor(/** @type {ClientOptions} */{
        api_key,
        secret_key,
        isSandbox = false
    }) {
        if (!api_key || !secret_key) throw new Error("API or Secret key or both are not supplied.");
        
        this.api_key = api_key;
        this.secret_key = secret_key;
        this.isSandbox = isSandbox;

        this.authentication = new Authentication(this);
        this.cards = new Cards(this);
        this.transactions = new Transactions(this);
        this.users = new Users(this);

        this.tokenExpiresAt = null;
        this.accessToken = null;
    }

    isAuthenticated() {
        if (!this.tokenExpiresAt) return false;
        return (Date.now() < this.tokenExpiresAt);
    }
}

module.exports = Client;
