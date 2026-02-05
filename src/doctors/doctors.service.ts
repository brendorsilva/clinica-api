import { ConflictException, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto, clinicId: string) {
    const existingDoctor = await this.prisma.doctor.findFirst({
      where: {
        OR: [{ crm: createDoctorDto.crm }, { email: createDoctorDto.email }],
      },
    });

    if (existingDoctor) {
      throw new ConflictException(
        'Já existe um médico com este CRM ou E-mail.',
      );
    }

    return this.prisma.doctor.create({
      data: { ...createDoctorDto, clinicId },
    });
  }

  findAll(clinicId: string, status?: Status) {
    return this.prisma.doctor.findMany({
      where: { clinicId, ...(status ? { status: status as Status } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string, clinicId: string) {
    return this.prisma.doctor.findUnique({
      where: { id, clinicId },
    });
  }

  update(id: string, updateDoctorDto: UpdateDoctorDto, clinicId: string) {
    return this.prisma.doctor.update({
      where: { id, clinicId },
      data: updateDoctorDto,
    });
  }

  remove(id: string, clinicId: string) {
    return this.prisma.doctor.delete({
      where: { id, clinicId },
    });
  }
}
