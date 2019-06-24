/*--------------------------------------------------------------
 *  Copyright (c) linuxgemini. All rights reserved.
 *  Licensed under the MIT License.
 *-------------------------------------------------------------*/

class ininalAPIError extends Error {
    public code: string;
    public date: Date;
    constructor(errcode = "0000", errmessage = "Critical code error on wrapper, contact @linuxgemini", ...params: any) {
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

export default ininalAPIError;