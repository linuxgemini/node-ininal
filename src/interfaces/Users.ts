import ininal from "..";
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
    private client: ininal;

    constructor(client: ininal) {
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

    getUserInfo(user_token: string): Promise<UserInfoObject> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: UserInfoObject = await this.sendRequest("GET", `/${user_token}`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }


    getUserCards(user_token: string): Promise<UserCard[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: UserCard[] = await this.sendRequest("GET", `/${user_token}/cards`, _reqconfig);
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    attachCard(user_token: string, lastDigits: string, barcodeNumber: string): Promise<CardToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardTokenObject = await this.sendRequest("POST", `/${user_token}/cards/attach`, _reqconfig, {
                    "lastDigits": lastDigits,
                    "barcodeNumber": barcodeNumber
                });
                return resolve(req.cardToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    createVirtualCard(user_token: string): Promise<CardToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: CardTokenObject = await this.sendRequest("POST", `/${user_token}/cards/virtual`, _reqconfig, {
                    "virtualCardChannel": "I",
                    "productCode": "IK"
                });
                return resolve(req.cardToken);
            } catch (error) {
                return reject(error);
            }
        });
    }

    updateGSMnumber(user_token: string, gsmNumber: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("PUT", `/${user_token}/gsmnumber`, _reqconfig, {
                    "gsmNumber": gsmNumber
                });
                return resolve(req);
            } catch (error) {
                return reject(error);
            }
        });
    }

    sendOTP(user_token: string): Promise<OTPToken> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: OTPTokenObject = await this.sendRequest("POST", `/${user_token}/send/otp`, _reqconfig);
                return resolve(req.token);
            } catch (error) {
                return reject(error);
            }
        });
    }

    verifyOTP(user_token: string, token: OTPToken, otp: string): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                let _reqconfig = await this._reqconfig();
                let req: {} = await this.sendRequest("POST", `/${user_token}/verify/otp`, _reqconfig, {
                    "token": token,
                    "otp": otp
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

export default Users;