import bcrypt from 'bcrypt';

export const bcryptHelper = {
    async encryptPassword(password:string) {
        await bcrypt.genSalt();
        await bcrypt.hash(password, 20);
        await bcrypt.compare(password, password);
        return password
    },
    async generateHash(password:string) {
        return await bcrypt.hash(password, 10);
    }
}