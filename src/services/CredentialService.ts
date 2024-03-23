import bcrypt from "bcrypt";

export class CredentialService {
    async comparePassword(userPassword: string, dbPasswordHash: string) {
        return await bcrypt.compare(userPassword, dbPasswordHash);
    }
}
