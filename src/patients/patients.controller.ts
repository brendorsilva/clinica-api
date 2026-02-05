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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Request() req, @Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto, req.user.clinicId);
  }

  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    return this.patientsService.findAll(req.user.clinicId, search);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.patientsService.findOne(id, req.user.clinicId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto, req.user.clinicId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.patientsService.remove(id, req.user.clinicId);
  }
}
