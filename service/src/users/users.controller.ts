

import { Controller, Body, Post, Get, ValidationPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/crate-user.dto';

@Controller('users')
export class UsersController {
    constructor(private userService:UsersService) {}

    @Post('create')
    create(@Body(ValidationPipe) createUserDto:CreateUserDto) {
        return this.userService.signup(createUserDto);
    }

    @Get('login')
    login(@Body(ValidationPipe) signupBody:{email:string, password:string}) {
        const {email, password} = signupBody
        return this.userService.login(email,password);
    }
}
