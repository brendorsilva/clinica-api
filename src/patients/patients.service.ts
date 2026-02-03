import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPatientDto: CreatePatientDto, clinicId: string) {
    return this.prisma.patient.create({
      data: {
        ...createPatientDto,
        birthDate: new Date(createPatientDto.birthDate),
        clinicId,
      },
    });
  }

  findAll(clinicId: string) {
    return this.prisma.patient.findMany({
      where: { clinicId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string, clinicId: string) {
    return this.prisma.patient.findUnique({ where: { id, clinicId } });
  }

  update(id: string, updatePatientDto: UpdatePatientDto, clinicId: string) {
    const data: any = { ...updatePatientDto };

    if (updatePatientDto.birthDate) {
      data.birthDate = new Date(updatePatientDto.birthDate);
    }

    return this.prisma.patient.update({
      where: { id, clinicId },
      data,
    });
  }

  remove(id: string, clinicId: string) {
    return this.prisma.patient.delete({ where: { id, clinicId } });
  }
}
