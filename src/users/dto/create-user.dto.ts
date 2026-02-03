import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

// Enum deve bater com o do Prisma
export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  receptionist = 'receptionist',
  doctor = 'doctor',
  financial = 'financial',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
