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
    return this.charactersService.findById(id);
  }
  
  @Get('favorite')
  @UseGuards(AuthGard)
  findFavorite(@Headers('authorizaton') authorization: string) {
    return this.charactersService.findFavorite(authorization);
  }
  
  
  @Post('favorite')
  create(
    @Body(ValidationPipe) createCharacterDto: CreateCharacterDto,

    @Headers('authorization') authorization: string,
  ) {
    return this.charactersService.createFavorite(
      createCharacterDto,
      authorization,
    );
  }


  @Delete('favorite/:id')
  @UseGuards(AuthGard)
  delete(
    @Param('id') id:number,
    @Headers('authorization') authorization: string
  ){
    return this.charactersService.removeFavorite(authorization, id);
  }
}
