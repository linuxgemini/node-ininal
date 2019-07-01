import Ininal from "..";
import ConnectionHandler from "../utilities/ConnectionHandler";

type UserToken = string;

interface UserTokenObject {
    userToken: UserToken;
}

interface UserInfoObject {
    userToken: UserToken;
    name: string;
    surname: string;
    email: string;
    gsmNumber: string;
    tckn: string;
    birthdate: string;
    status: string;
}

interface UserCard {
    cardToken: string;
    status: string;
}

type CardToken = string;

interface CardTokenObject {
    cardToken: CardToken;
}

type OTPToken = string;

interface OTPTokenObject {
    token: OTPToken;
}

class Users extends ConnectionHandler {
    /**
     * @ignore
     */
    private client: Ininal;

    /**
     * @ignore
     */
    constructor(client: Ininal) {
        super((client.SANDBOX ? "https://sandbox-api.ininal.com/v2/users/" : "https://api.ininal.com/v2/users/"));
        this.client = client;
    }

    createUser(name: string, surname: string, email: string, gsmNumber: string, tcIdentificationNumber: string, password: string, birthDate: string, motherMaidenName: string): Promise<UserToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: UserTokenObject = await this.sendRequest("POST", "", _reqconfig, {
                    "name": name,
                    "surname": surname,
                    "email": email,
                    "gsmNumber": gsmNumber,
                    "tcIdentificationNumber": tcIdentificationNumber,
                    "password": password,
                    "birthDate": birthDate,
                    "motherMaidenName": motherMaidenName
                });
                return resolve(req.userToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    getUserInfo(userToken: string): Promise<UserInfoObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: UserInfoObject = await this.sendRequest("GET", `/${userToken}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }


    getUserCards(userToken: string): Promise<UserCard[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: UserCard[] = await this.sendRequest("GET", `/${userToken}/cards`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    attachCard(userToken: string, lastDigits: string, barcodeNumber: string): Promise<CardToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardTokenObject = await this.sendRequest("POST", `/${userToken}/cards/attach`, _reqconfig, {
                    "lastDigits": lastDigits,
                    "barcodeNumber": barcodeNumber
                });
                return resolve(req.cardToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    createVirtualCard(userToken: string): Promise<CardToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardTokenObject = await this.sendRequest("POST", `/${userToken}/cards/virtual`, _reqconfig, {
                    "virtualCardChannel": "I",
                    "productCode": "IK"
                });
                return resolve(req.cardToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    updateGSMnumber(userToken: string, gsmNumber: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("PUT", `/${userToken}/gsmnumber`, _reqconfig, {
                    "gsmNumber": gsmNumber
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    sendOTP(userToken: string): Promise<OTPToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: OTPTokenObject = await this.sendRequest("POST", `/${userToken}/send/otp`, _reqconfig);
                return resolve(req.token);
            } catch (error) {
                return reject(error);
            }
        });
    }

    verifyOTP(userToken: string, token: OTPToken, otp: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("POST", `/${userToken}/verify/otp`, _reqconfig, {
                    "token": token,
                    "otp": otp
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    /**
     * @ignore
     */
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

export default Users;
