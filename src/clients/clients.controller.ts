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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createClientDto: CreateClientDto, @Req() req) {
    return this.clientsService.create(createClientDto, req.user);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('/byUser')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Req() req) {
    return this.clientsService.findAllByUserId(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.clientsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req,
  ) {
    return this.clientsService.update(+id, updateClientDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.clientsService.remove(+id, req.user);
  }
}
