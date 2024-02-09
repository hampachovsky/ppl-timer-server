import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTagDto: CreateTagDto, @Req() req) {
    return this.tagsService.create(createTagDto, req.user);
  }

  @Get('/byUser')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Req() req, @Query() query: { type: string; qs: string }) {
    return this.tagsService.findAllByUserId(req.user, query);
  }

  @Get('/byTimer/:id')
  @UseGuards(JwtAuthGuard)
  findAllByTimerId(@Param('id') id: string, @Req() req) {
    return this.tagsService.findAllByTimerId(+id, req.user);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.tagsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() req,
  ) {
    return this.tagsService.update(+id, updateTagDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.tagsService.remove(+id, req.user);
  }
}
