import { IsEmail } from 'class-validator';

export class UserInfoDto {
    @IsEmail({}, { message: 'Неверно указан email' })
    email: string;
}
