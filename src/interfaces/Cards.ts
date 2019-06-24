import Ininal from ".."
import ConnectionHandler from "../utilities/ConnectionHandler";

interface CardInfo {
    name: string;
    surname: string;
    cardStatusCode: string;
    cardReasonCode: string;
    isVirtualCard: string;
    barcodeNo: string;
    cardNumber: string;
    productCode: string;
    registered: boolean;
    availableLimit: string;
    loadableLimit: number;
    monthlyLoadableLimit: string;
    expDate: string;
    cvv: string;
}

interface AnonymousVirtualCardData {
    cardNumber: string;
    barcodeNumber: string;
    cvv: string;
    expDate: string;
}

interface CardBalanceObject {
    cardNumber: string;
    availableLimit: string;
    loadableLimit: number;
    monthlyLoadableLimit: string;
}

type UTCString = string;

interface CardTransactionData {
    transactionDate: string;
    merchant: string;
    referenceNo: string;
    transactionType: string;
    amount: string;
    currency: string;
    merchantCategory: string;
}

type TransferToken = string;

interface TransferTokenObject {
    transferToken: string;
}

class Cards extends ConnectionHandler {
    private client: Ininal;
    constructor(client: Ininal) {
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/cards/" : "https://api.ininal.com/v2/cards/"));
        this.client = client;
    }

    getCardInfo(cardToken: string): Promise<CardInfo> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardInfo = await this.sendRequest("GET", `/${cardToken}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    createAnonymousVirtualCard(): Promise<AnonymousVirtualCardData> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: AnonymousVirtualCardData = await this.sendRequest("POST", "/virtual", _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    updateCardStatus(cardToken: string, userToken: string, cardStatus: "BLOCK" | "UNBLOCK"): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("PUT", `/${cardToken}/status`, _reqconfig, {
                    "userToken": userToken,
                    "cardStatus": cardStatus
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    getCardBalance(cardToken: string): Promise<CardBalanceObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardBalanceObject = await this.sendRequest("GET", `/${cardToken}/balance`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    setOrRemindCardPin(cardToken: string, issuingType: "NEW" | "OLD"): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("PUT", `/${cardToken}/pin`, _reqconfig, {
                    "issuingType": issuingType
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    getCardTransactions(cardToken: string, startDate: UTCString, endDate: UTCString): Promise<CardTransactionData> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardTransactionData = await this.sendRequest("GET", `/${cardToken}/transactions/${startDate}/${endDate}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    startBalanceTransfer(sourceCardToken: string, targetBarcodeNumber: string, feeResource: "SOURCE" | "TARGET", amount: number, desc: string = ""): Promise<TransferToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: TransferTokenObject = await this.sendRequest("POST", `/${sourceCardToken}/transfer`, _reqconfig, {
                    "targetBarcodeNumber": targetBarcodeNumber,
                    "feeResource": feeResource,
                    "amount": amount,
                    "desc": desc
                });
                return resolve(req.transferToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    endBalanceTransfer(sourceCardToken: string, transferToken: TransferToken): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("PUT", `/${sourceCardToken}/transfer`, _reqconfig, {
                    "transferToken": transferToken
                });
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

export default Cards;