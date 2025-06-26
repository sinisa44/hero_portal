import { Module } from '@nestjs/common';
import { ComicsService } from './comics.service';
import { ComicsController } from './comics.controller';
import {MongooseModule} from '@nestjs/mongoose'
import { Comic, ComicSchema } from './schemas/comic.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Comic.name, schema:ComicSchema}])
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
  exports: [ComicsService],
})
export class ComicsModule {}
