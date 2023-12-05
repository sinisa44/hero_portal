import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt/dist';
import { CharactersModule } from './characters/characters.module';
import { ComicsModule } from './comics/comics.module';
import { CreatorsModule } from './creators/creators.module';

@Module({
  imports: [
  
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true
    }),
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:'3h'}
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    CharactersModule,
    ComicsModule,
    CreatorsModule,
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
