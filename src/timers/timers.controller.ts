import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateTimerDto } from './dto/create-timer.dto';
import {
  AssignProjectToTimerDto,
  UpdateTagsForTimerDto,
} from './dto/timer.dto';
import { UpdateTimerDto } from './dto/update-timer.dto';
import { TimersService } from './timers.service';

@Controller('timers')
export class TimersController {
  constructor(private readonly timersService: TimersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTimerDto: CreateTimerDto, @Req() req) {
    return this.timersService.create(createTimerDto, req.user);
  }

  @Get('/')
  findAll() {
    return this.timersService.findAll();
  }

  @Get('/byUser')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Req() req) {
    return this.timersService.findAllByUserId(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.timersService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTimerDto: UpdateTimerDto,
    @Req() req,
  ) {
    return this.timersService.update(+id, updateTimerDto, req.user);
  }

  @Patch('/assignProjectToTimer/:id')
  @UseGuards(JwtAuthGuard)
  assignProjectToTimer(
    @Param('id') id: string,
    @Body() assignProjectToTimerDto: AssignProjectToTimerDto,
    @Req() req,
  ) {
    return this.timersService.assignProjectToTimer(
      +id,
      assignProjectToTimerDto,
      req.user,
    );
  }

  @Patch('/updateTagsForTimer/:id')
  @UseGuards(JwtAuthGuard)
  updateTagsForTimer(
    @Param('id') id: string,
    @Body() updateTagsForTimerDto: UpdateTagsForTimerDto,
    @Req() req,
  ) {
    return this.timersService.updateTagsForTimer(
      +id,
      updateTagsForTimerDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.timersService.remove(+id, req.user);
  }
}
