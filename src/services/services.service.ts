import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto, clinicId: string) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        clinicId,
      },
    });
  }

  findAll(clinicId: string, status?: Status) {
    return this.prisma.service.findMany({
      where: { clinicId, ...(status ? { status: status as Status } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, clinicId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id, clinicId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado ou acesso negado.');
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    clinicId: string,
  ) {
    await this.findOne(id, clinicId);

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
