import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum AppointmentStatus {
  scheduled = 'scheduled',
  confirmed = 'confirmed',
  completed = 'completed',
  cancelled = 'cancelled',
}

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @IsDateString() // Frontend envia ISO String (ex: 2026-02-02T00:00:00.000Z)
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string; // "09:00"

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
