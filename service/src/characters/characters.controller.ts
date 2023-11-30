import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Headers } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { AuthGard } from 'src/users/auth.gard';
import { Request } from 'express'
import decodeToken from './lib/decodeToken.lib';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto,@Headers('authorization') authorization: string) {
    
    return this.charactersService.create(createCharacterDto, authorization);
  }

  @Get('all/')
  @UseGuards(AuthGard)
  findAll(@Query('limit') limit:number, @Query('offset') offset:number ) {
    return this.charactersService.findAll({limit, offset});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.charactersService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.charactersService.remove(+id);
  }
}
