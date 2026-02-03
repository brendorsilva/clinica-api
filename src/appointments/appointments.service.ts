import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, clinicId: string) {
    const { patientId, doctorId, serviceId, ...rest } = createAppointmentDto;

    // 1. Validar se as entidades existem e pertencem à clínica
    // Isso evita que um usuário mal intencionado agende um paciente de outra clínica
    const [patient, doctor, service] = await Promise.all([
      this.prisma.patient.findFirst({ where: { id: patientId, clinicId } }),
      this.prisma.doctor.findFirst({ where: { id: doctorId, clinicId } }),
      this.prisma.service.findFirst({ where: { id: serviceId, clinicId } }),
    ]);

    if (!patient || !doctor || !service) {
      throw new BadRequestException(
        'Paciente, Médico ou Serviço inválidos (ou não pertencem à sua clínica).',
      );
    }

    // 2. Criar o agendamento
    // O preço é pego automaticamente do serviço cadastrado para consistência
    return this.prisma.appointment.create({
      data: {
        ...rest,
        price: service.price, // Copia o preço atual do serviço
        patientId,
        doctorId,
        serviceId,
        clinicId,
        date: new Date(rest.date), // Converte string para Date
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
      },
    });
  }

  // Permite filtrar por data (essencial para o calendário do frontend)
  findAll(clinicId: string, startDate?: string, endDate?: string) {
    const where: any = { clinicId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        // Traz os dados relacionados para preencher a tabela
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, clinicId: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, clinicId },
      include: {
        patient: true,
        doctor: true,
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    clinicId: string,
  ) {
    await this.findOne(id, clinicId); // Garante existência

    const data: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.date) {
      data.date = new Date(updateAppointmentDto.date);
    }

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
        service: { select: { name: true } },
      },
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);
    return this.prisma.appointment.delete({ where: { id } });
  }
}
