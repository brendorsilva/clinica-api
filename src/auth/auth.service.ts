import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { RegisterClinicDto } from './dto/register-clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerClinic(dto: RegisterClinicDto) {
    // 1. Verificar se e-mail já existe no sistema
    const userExists = await this.usersService.findByEmail(dto.userEmail);
    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2. Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Transação: Cria Clínica E Usuário juntos
    return this.prisma.$transaction(async (tx) => {
      // Cria a clínica
      const clinic = await tx.clinic.create({
        data: {
          name: dto.clinicName,
        },
      });

      // Cria o usuário vinculado à clínica
      const user = await tx.user.create({
        data: {
          name: dto.userName,
          email: dto.userEmail,
          password: hashedPassword,
          role: UserRole.admin, // Quem cadastra a clínica é sempre Admin
          clinicId: clinic.id, // VÍNCULO IMPORTANTE
        },
      });

      // Retorno limpo
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { password, ...userWithoutPassword } = user;

      return {
        message: 'Clínica registrada com sucesso!',
        clinic: { id: clinic.id, name: clinic.name },
        user: userWithoutPassword,
      };
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    // 1. Validar se usuário existe e se senha bate
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const permissionsArray = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    // 2. Gerar Payload do Token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
      permissions: permissionsArray,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        permissions: permissionsArray,
      },
    };
  }
}
