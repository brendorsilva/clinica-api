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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.clinicId,
    );
  }

  @Get()
  findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.findAll(
      req.user.clinicId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.findOne(id, req.user.clinicId);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user.clinicId,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.appointmentsService.remove(id, req.user.clinicId);
  }
}
