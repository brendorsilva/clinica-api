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
  Query,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Status } from '@prisma/client';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Request() req, @Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto, req.user.clinicId);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: Status) {
    return this.doctorsService.findAll(req.user.clinicId, status);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.doctorsService.findOne(id, req.user.clinicId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto, req.user.clinicId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.doctorsService.remove(id, req.user.clinicId);
  }
}
