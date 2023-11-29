import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports: [
  
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal:true
    }),
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:'2h'}
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
