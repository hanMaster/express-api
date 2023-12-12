import { UserModel } from '@prisma/client';
import { compare, genSaltSync, hash } from 'bcryptjs';

export class User {
    private _password: string;
    constructor(
        private readonly _email: string,
        private readonly _name: string,
    ) {}

    public static fromUserModel(dbUser: UserModel): User {
        const user = new User(dbUser.email, dbUser.name);
        user._password = dbUser.password;
        return user;
    }

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get password(): string {
        return this._password;
    }

    public async setPassword(password: string, saltLength: number): Promise<void> {
        const salt = genSaltSync(saltLength);
        this._password = await hash(password, salt);
    }

    public async validatePassword(password: string): Promise<boolean> {
        return compare(password, this._password);
    }
}
