/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

module.exports = {
    Client: require("./client/Client"),
    
    ConnectionHandler: require("./utilities/ConnectionHandler"),

    Authentication: require("./interfaces/Authentication"),
    Users: require("./interfaces/Users"),
    Cards: require("./interfaces/Cards"),
    Transactions: require("./interfaces/Transactions"),
};