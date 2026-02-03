import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Cria vinculando à clínica
  create(createServiceDto: CreateServiceDto, clinicId: string) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        clinicId, // <--- Vínculo de segurança
      },
    });
  }

  // Lista APENAS serviços da clínica do usuário
  findAll(clinicId: string) {
    return this.prisma.service.findMany({
      where: { clinicId },
      orderBy: { name: 'asc' },
    });
  }

  // Busca um serviço específico, validando se pertence à clínica
  async findOne(id: string, clinicId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, clinicId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado ou acesso negado.');
    }

    return service;
  }

  // Atualiza garantindo que é da clínica
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    clinicId: string,
  ) {
    // Primeiro verificamos se existe/pertence (reutilizando lógica)
    await this.findOne(id, clinicId);

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  // Remove garantindo que é da clínica
  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
