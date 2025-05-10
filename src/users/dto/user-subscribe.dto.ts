import { IsEmail, IsNotEmpty } from "class-validator";

export class UserSubscribeDto {

    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

}