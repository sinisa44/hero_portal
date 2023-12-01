import { Controller, Get, Query } from '@nestjs/common';
import { ComicsService } from './comics.service';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}


  @Get('all/')
  findAll(
    @Query('limit') limit:number,
    @Query('offset') offset:number
  ) {
    return this.comicsService.findAll({limit, offset})
  }
  
}
