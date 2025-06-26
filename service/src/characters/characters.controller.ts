import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Headers,
  ValidationPipe,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AuthGard } from 'src/users/auth.gard';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('all/')
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.charactersService.findAll({ limit, offset });
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.charactersService.findById({ id });
  }

  @Get('favorite/all')
  @UseGuards(AuthGard)
  findFavorite(@Headers('authorization') authorization: string) {
    return this.charactersService.listAllFavorite({ authorization });
  }

  @Get('/favorite/:id')
  @UseGuards(AuthGard)
  findFavoriteById(
    @Headers('authorization') authorization: string,
    @Param('id') id: string,
  ) {
    return this.charactersService.findFavoriteById({ authorization, id });
  }

  @Post('favorite')
  create(
    @Body(ValidationPipe) createCharacterDto: CreateCharacterDto,

    @Headers('authorization') authorization: string,
  ) {
    return this.charactersService.createFavorite(createCharacterDto, {
      authorization,
    });
  }
  @Post('favoriteById')
  createById(
    @Body('id') id: number,
    @Headers('authorization') authorization: string,
  ) {
    return this.charactersService.saveFavoriteById(id, { authorization });
  }

  @Delete('favorite/:id')
  @UseGuards(AuthGard)
  delete(
    @Param('id') id: number,
    @Headers('authorization') authorization: string,
  ) {
    return this.charactersService.removeFavorite({ authorization, id });
  }

  @Get('search/:name')
  @UseGuards(AuthGard)
  search(
    @Param('name') name: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.charactersService.search(name);
  }

  // @Get('/seed/characters')
  // base(@Headers('authorization') authorization: string)
  // {
  //   return this.charactersService.seed(authorization);
  // }

  
}
