import Ininal from ".."
import ConnectionHandler from "../utilities/ConnectionHandler";

interface TransactionInObject {
    transactionId: string;
    barcodeNumber: string;
    amount: string;
}

type ProvisionCode = string;

interface ProvisionCodeObject {
    provisionCode: ProvisionCode;
}

type ReferenceNumber = string;

interface ReferenceNumberObject {
    referenceNumber: ReferenceNumber;
}

interface PointOfSaleObject {
    coordinateY: string;
    coordinateX: string;
    type: string;
    name: string;
    description: string;
    address: string;
    icon: string;
}

class Transactions extends ConnectionHandler {
    private client: Ininal;
    constructor(client: Ininal) {
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/transactions/" : "https://api.ininal.com/v2/transactions/"));
        this.client = client;
    }

    loadBalance(barcodeNumber: string, transactionId: string, amount: string): Promise<TransactionInObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: TransactionInObject = await this.sendRequest("POST", `/in`, _reqconfig, {
                    "cashOfficeId": "1401",
                    "barcodeNumber": barcodeNumber,
                    "transactionId": transactionId,
                    "amount": amount
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    cancelLoadBalance(barcodeNumber: string, transactionId: string, amount: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("POST", `/in/cancel`, _reqconfig, {
                    "cashOfficeId": "1401",
                    "barcodeNumber": barcodeNumber,
                    "transactionId": transactionId,
                    "amount": amount
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    unloadBalance(cardToken: string, amount: string, description = ""): Promise<ProvisionCode> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: ProvisionCodeObject = await this.sendRequest("POST", `/out`, _reqconfig, {
                    "cardToken": cardToken,
                    "amount": amount,
                    "description": description
                });
                return resolve(req.provisionCode);
            } catch (error) {
                return reject(error);
            }
        });
    }

    finishUnloadBalance(provisionCode: ProvisionCode, otp: string): Promise<ReferenceNumber> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: ReferenceNumberObject = await this.sendRequest("PUT", `/${provisionCode}/out`, _reqconfig, {
                    "otp": otp
                });
                return resolve(req.referenceNumber);
            } catch (error) {
                return reject(error);
            }
        });
    }

    cancelUnloadBalance(cardToken: string, referenceNumber: ReferenceNumber): Promise<""> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: "" = await this.sendRequest("POST", `/out/cancel`, _reqconfig, {
                    "cardToken": cardToken,
                    "referenceNumber": referenceNumber
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    getNearestPointOfSale(xCoords: string, yCoords: string): Promise<PointOfSaleObject[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: PointOfSaleObject[] = await this.sendRequest("GET", `/locations/${yCoords}/${xCoords}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    private _reqconfig(): Promise<{ authType: "bearer", bearerToken: string }> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.client.isAuthenticated()) await this.client.authentication.authenticate();
                return resolve({
                    authType: "bearer",
                    bearerToken: this.client.ACCESSTOKEN
                });
            } catch (error) {
                return reject(error);
            }
        });
    }
}

export default Transactions;