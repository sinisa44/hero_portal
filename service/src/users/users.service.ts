import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/crate-user.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';




@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {



    const { username, email, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(email, password): Promise<{token: string}>{
    const findUser = await this.userModel.findOne({email});

    if(!findUser) {
        throw new NotFoundException()
    }

    if(!bcrypt.compare(password, findUser?.password)) {
        throw new UnauthorizedException()
    } 

    const payload = {sub:findUser._id, username:findUser.email};

    return {token: await this.jwtService.signAsync(payload)};
  }


}
