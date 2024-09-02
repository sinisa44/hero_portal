import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Headers,
  ValidationPipe,
} from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { AuthGard } from 'src/users/auth.gard';
import { CreateCreatorDto } from './dtos/create-creator.dto';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Get('all')
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.creatorsService.fetchAll({ limit, offset });
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.creatorsService.fetchById({id});
  }

  @Get('favorite/all')
  @UseGuards(AuthGard)
  listAllFavorite(@Headers('authorization') authorization: string) {
    return this.creatorsService.listAllFavorites({authorization});
  }

  @Get("/favorite/:id")
  @UseGuards(AuthGard)
  findFavoriteById(
    @Param('id') id:string,
    @Headers('authorization') authorization:string
  ) {}

  @UseGuards(AuthGard)
  @Post('/favorite')
  createFavorite(
    @Body(ValidationPipe) createCreatorDto: CreateCreatorDto,
    @Headers('authorization') authorization: string,
  ) {
    return this.creatorsService.saveFavorite({authorization}, createCreatorDto);
  }

  @UseGuards(AuthGard)
  @Delete('/favorite/:id')
  deleteFavorite(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.creatorsService.removeFavorite({authorization, id});
  }
}
