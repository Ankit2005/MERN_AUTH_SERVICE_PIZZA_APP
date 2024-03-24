import fs from "fs";
import rsaPemToJwk from "rsa-pem-to-jwk";

const privateKey = fs.readFileSync("./certs/private.pem");

const jwk = rsaPemToJwk(privateKey, { use: "sign" }, "public");

console.log(JSON.stringify(jwk));
