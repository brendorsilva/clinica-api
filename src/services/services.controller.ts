import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard) // <--- Proteção Global do Módulo
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto, req.user.clinicId);
  }

  @Get()
  findAll(@Request() req) {
    return this.servicesService.findAll(req.user.clinicId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.servicesService.findOne(id, req.user.clinicId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto, req.user.clinicId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.servicesService.remove(id, req.user.clinicId);
  }
}
