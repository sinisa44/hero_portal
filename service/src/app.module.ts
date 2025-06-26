// import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt/dist';
import { CharactersModule } from './characters/characters.module';
import { ComicsModule } from './comics/comics.module';
import { CreatorsModule } from './creators/creators.module';
import { UiModule } from './ui/ui.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AppService } from './app.service';
import { CommandModule } from 'nestjs-command';
import { CharacterCommand } from './characters/characters.command';
import { ComicsCommand } from './comics/comics.command';
import { CreatorsCommand } from './creators/creators.command';
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
    UiModule,
    CommandModule
   ],
  controllers: [AppController],
  providers: [AppService, CharacterCommand, ComicsCommand, CreatorsCommand],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}