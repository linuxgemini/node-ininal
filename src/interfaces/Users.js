/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

const ConnectionHandler = require("../utilities/ConnectionHandler");

/**
 * @typedef {string} name Name of the user.
 * @typedef {string} surname Surname of the user.
 * @typedef {string} email E-Mail address of the user.
 * @typedef {string} gsmNumber GSM number of the user. Must be 10 digits with no 0 in the beginning. Example: 5xxxxxxxxx
 * @typedef {string} tcIdentificationNumber Turkish Republic Identification Number of the user.
 * @typedef {string} password Password of the user.
 * @typedef {string} birthDate Birthday of the user. Must be in YYYY-MM-DD format.
 * @typedef {string} motherMaidenName Mother's Maiden Name of the user.
 * @typedef {string} userToken Token of the user.
 * @typedef {string} cardToken Token of the card.
 * @typedef {string} status Status of the card.
 * @typedef {string} lastDigits Last 4 digits of the ininal card.
 * @typedef {string} barcodeNumber Barcode number of the ininal card.
 * @typedef {string} OTPtoken Token for OTP verification.
 * @typedef {string} otp One-Time Password/Passkey.
 */

/**
 * @typedef {Object} UserCreationObject Object used in user creation.
 * @property {name} name Name of the user.
 * @property {surname} surname Surname of the user.
 * @property {email} email E-Mail address of the user.
 * @property {gsmNumber} gsmNumber GSM number of the user. Must be 10 digits with no 0 in the beginning. Example: 5xxxxxxxxx
 * @property {tcIdentificationNumber} tcIdentificationNumber Turkish Republic Identification Number of the user.
 * @property {password} password Password of the user.
 * @property {birthDate} birthDate Birthday of the user. Must be in YYYY-MM-DD format.
 * @property {motherMaidenName} motherMaidenName Mother's Maiden Name of the user.
 */

/**
 * @typedef {Object} UserInfoObject Object of user information.
 * @property {userToken} userToken Token of the user.
 * @property {name} name Name of the user.
 * @property {surname} surname Surname of the user.
 * @property {email} email E-Mail address of the user.
 * @property {gsmNumber} gsmNumber GSM number of the user.
 * @property {tcIdentificationNumber} tckn Turkish Republic Identification Number of the user.
 * @property {birthdate} birthdate Birthday of the user in YYYY-MM-DD format.
 * @property {status} status Status of the card.
 */

/**
 * @typedef {Object} BasicCardInfoObject 
 * @property {cardToken} cardToken Token of the user's card.
 * @property {status} status Status of the user's card.
 */

/**
 * @typedef {Array<BasicCardInfoObject>} UserCardsArray
 */

/**
 * @typedef {Object} CardInfoToPersonaliseObject Card information object for personalisation operation.
 * @property {lastDigits} lastDigits Last 4 digits of the ininal card.
 * @property {barcodeNumber} barcodeNumber Barcode number of the ininal card.
 */

/**
 * @typedef {Object} GSMnumberUpdateObject
 * @property {gsmNumber} gsmNumber GSM number of the user. Must be 10 digits with no 0 in the beginning. Example: 5500000000
 */

/**
 * @typedef {Object} userTokenObject
 * @property {userToken} userToken Token of the user.
 */

/**
 * @typedef {Object} cardTokenObject
 * @property {cardToken} cardToken Token of the card.
 */

/**
 * @typedef {Object} OTPtokenObject
 * @property {OTPtoken} token Token of the OTP Challenge request. Must be used while responding to the challenge.
 */

/**
 * @typedef {Object} OTPresponseObject
 * @property {OTPtoken} token
 * @property {otp} otp
 */

/**
 * Users interface.
 * @class Users
 * @memberOf ConnectionHandler
 */
class Users extends ConnectionHandler {
    /**
     * Constructor of the Users interface.
     * @constructor
     * @param {Object} client 
     */
    constructor(client) {
        if (!client) throw new Error("Non-client call");
        super({
            endpoint: (client.isSandbox ? "https://sandbox-api.ininal.com/v2/users/" : "https://api.ininal.com/v2/users/")
        });
        this.client = client;
    }

    /**
     * Create a user.
     * @returns {Promise<userTokenObject>} Token of the user in a Promise.
     */
    createUser(/** @type {UserCreationObject} */ {
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
     * Get user information.
     * @param {userToken} user_token
     * @returns {Promise<UserInfoObject>}
     */
    getUserInfo(user_token) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token) throw new Error("User token hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("GET", `/${user_token}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Get user's cards.
     * @param {userToken} user_token
     * @returns {Promise<UserCardsArray>} Array of "BasicCardInfoObject"s.
     */
    getUserCards(user_token) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token) throw new Error("User token hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("GET", `/${user_token}/cards`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Attach a card to the user.
     * @param {userToken} user_token
     * @returns {Promise<cardTokenObject>}
     */
    attachCard(user_token, /** @type {CardInfoToPersonaliseObject} */ {
        lastDigits,
        barcodeNumber
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token || !lastDigits || !barcodeNumber) throw new Error("User token or card informations hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("POST", `/${user_token}/cards/attach`, _reqconfig, { lastDigits, barcodeNumber });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Create a virtual card.
     * @param {userToken} user_token 
     * @returns {Promise<cardTokenObject>}
     */
    createVirtualCard(user_token) {
        return new Promise(async (resolve, reject) => {
            var obj = {
                virtualCardChannel: "I",
                productCode: "IK"
            };
            try {
                if (!user_token) throw new Error("User token hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("POST", `/${user_token}/cards/virtual`, _reqconfig, obj);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Update the GSM number of the user.
     * @param {userToken} user_token 
     * @returns {Promise<{}>} 
     */
    updateGSMnumber(user_token, /** @type {GSMnumberUpdateObject} */ {
        gsmNumber
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token || !gsmNumber) throw new Error("User token or gsmNumber hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("PUT", `/${user_token}/gsmnumber`, _reqconfig, { gsmNumber });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Send a One-time Password to the user.
     * @param {userToken} user_token 
     * @returns {Promise<OTPtokenObject>}
     */
    sendOTP(user_token) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token) throw new Error("User token hasn't been entered.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("POST", `/${user_token}/send/otp`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Verify the OTP that was sent to the user.
     * @param {userToken} user_token 
     * @returns {Promise<{}>} 
     */
    verifyOTP(user_token, /** @type {OTPresponseObject} */ {
        token,
        otp
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user_token || !token || !otp) throw new Error("One or more variables are missing.");
                var _reqconfig = await this._reqconfig();
                var req = await this.sendRequest("POST", `/${user_token}/verify/otp`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * Create authentication object.
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