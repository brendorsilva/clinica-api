import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

    // 3. Salvar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        clinicId,
      },
    });

    return result; // Retorna o usuário SEM a senha
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOne(id: string, clinicId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.prisma.user.findUnique({ where: { id, clinicId } });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Implemente findAll, update e remove conforme necessário...
}
