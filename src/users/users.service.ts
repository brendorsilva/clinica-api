import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { permission } from 'process';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, clinicId: string) {
    // 1. Verificar se e-mail já existe
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // 2. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const permissionsString = createUserDto.permissions
      ? createUserDto.permissions.join(',')
      : '';

    // 3. Salvar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        clinicId,
        permissions: permissionsString,
      },
    });

    return result; // Retorna o usuário SEM a senha
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    if (data.permissions) {
      data.permissions = data.permissions.join(',');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findAll(clinicId: string) {
    const users = await this.prisma.user.findMany({
      where: { clinicId },
    });

    return users.map((user) => ({
      ...user,
      permissions: user.permissions ? user.permissions.split(',') : [],
    }));
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      permissions: user.permissions ? user.permissions.split(',') : [],
    };
  }

  async findOne(id: string, clinicId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.prisma.user.findUnique({ where: { id, clinicId } });
    if (user) {
      const { password, ...result } = user;
      return {
        ...result,
        permissions: user.permissions ? user.permissions.split(',') : [],
      };
    }
    return null;
  }

  // Implemente findAll, update e remove conforme necessário...
}
