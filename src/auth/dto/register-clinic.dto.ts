import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterClinicDto {
  // Dados da Clínica
  @IsString()
  @IsNotEmpty()
  clinicName: string;

  // Dados do Usuário Admin (Dono)
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @MinLength(6)
  password: string;
}
