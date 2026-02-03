import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum ServiceStatus {
  active = 'active',
  inactive = 'inactive',
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  duration: number; // Em minutos

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;
}
