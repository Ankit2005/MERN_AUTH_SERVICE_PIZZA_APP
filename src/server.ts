import { Config } from "./config";

function login(userName: string): string {
    // eslint-disable-next-line no-console
    console.log("APP IS RUNNING ON PORT : ", Config.PORT);
    return userName;
}

login("ankit");
