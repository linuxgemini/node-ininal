/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

"use strict";

class ininalAPIError extends Error {
    constructor(errcode = "0000", errmessage = "Critical code error on wrapper, contact @linuxgemini", ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ininalAPIError);
        }

        // Custom debugging information
        this.name = "ininalAPIError";
        this.code = errcode;
        this.message = errmessage;
        this.date = new Date();
    }
}

module.exports = ininalAPIError;