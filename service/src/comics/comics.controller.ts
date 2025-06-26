import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ComicsService } from './comics.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { AuthGard } from 'src/users/auth.gard';

@Controller('comics')
export class ComicsController {
  constructor(private readonly comicsService: ComicsService) {}

  @Get('all/')
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.comicsService.findAll({ limit, offset });
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.comicsService.findById({ id });
  }

  @Get('favorite/all')
  findFavorites(@Headers('authorization') authorization: string) {
    return this.comicsService.findAllFavorites({ authorization });
  }

  @Get('favorite/:id')
  @UseGuards(AuthGard)
  findFavoriteById(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ) {
    return this.comicsService.findFavoriteById({ authorization, id });
  }

  @Post('favorite')
  @UseGuards(AuthGard)
  create(
    @Body(ValidationPipe) createComicDto: CreateComicDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.comicsService.createFavoriteComic(createComicDto, {
      authorization,
    });
  }

  @Post('favoriteById')
  @UseGuards(AuthGard)
  createById(
    @Headers('authorization') authorization: string,
    @Body('id') id: number,
  ) {
    return this.comicsService.createFavoriteById({ authorization }, id);
  }

  @Delete('favorite/:id')
  @UseGuards(AuthGard)
  deleteFavorite(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ) {
    return this.comicsService.removeFavorite({ authorization, id });
  }
}
