import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateTimerDto } from './dto/create-timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { TimersService } from './timers.service';

@Controller('timers')
export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTimerDto: CreateTimerDto, @Request() req) {
    return this.timersService.create(createTimerDto, req.user);
  }

  @Get('/')
  findAll() {
    return this.timersService.findAll();
  }

  @Get('/byUser')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Request() req) {
    return this.timersService.findAllByUserId(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.timersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTimerDto: UpdateTimerDto) {
    return this.timersService.update(+id, updateTimerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.timersService.remove(+id);
  }
}
