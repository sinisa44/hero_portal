import {IsEmail, IsNotEmpty, IsString,} from 'class-validator';

export class CreateUserDto{
    @IsNotEmpty({message:'username is required'})
    @IsString()
    readonly username:string


    @IsNotEmpty({message:"email is required"})
    @IsEmail()
    @IsString()
    readonly email:string


    @IsNotEmpty({message:'password is required'})
    @IsString()
    readonly password:string
}