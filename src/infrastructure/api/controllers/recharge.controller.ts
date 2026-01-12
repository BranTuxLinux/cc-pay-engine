import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CreateRechargeUseCase } from '../../../domain/use-case/create-recharge.use-case';
import { ListRechargesUseCase } from '../../../domain/use-case/list-recharges.use-case';
import { CreateRechargeDto } from '../dtos/create-recharge.dto';
import { RechargeResponseDto } from '../dtos/recharge-response.dto';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('recharges')
@Controller('recharges')
@UseGuards(RolesGuard)
export class RechargeController {
  constructor(
    private readonly createRechargeUseCase: CreateRechargeUseCase,
    private readonly listRechargesUseCase: ListRechargesUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Crear una nueva recarga',
    description:
      'Crea una recarga de wallet convirtiendo moneda fiat a criptomoneda. ' +
      'Solo usuarios con rol ADMIN pueden crear recargas. ' +
      'Si la wallet no existe, se crea automáticamente.',
  })
  @ApiBody({ type: CreateRechargeDto })
  @ApiResponse({
    status: 201,
    description: 'Recarga creada exitosamente',
    type: RechargeResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos (validación fallida)',
  })
  @ApiForbiddenResponse({
    description: 'Usuario sin permisos (requiere rol ADMIN)',
  })
  async create(@Body() dto: CreateRechargeDto): Promise<RechargeResponseDto> {
    return this.createRechargeUseCase.execute(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.READ_ONLY)
  @ApiOperation({
    summary: 'Listar recargas',
    description:
      'Lista todas las recargas del sistema o las recargas de un usuario específico. ' +
      'Usuarios con rol ADMIN o READ_ONLY pueden listar recargas. ' +
      'Si no se proporciona userId, se retornan todas las recargas del sistema (útil para auditoría).',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID del usuario para filtrar recargas. Si se omite, retorna todas las recargas del sistema',
    example: '00000000-0000-0000-0000-000000000001',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recargas (todas o filtradas por usuario)',
    type: [RechargeResponseDto],
  })
  @ApiForbiddenResponse({
    description: 'Usuario sin permisos (requiere rol ADMIN o READ_ONLY)',
  })
  async list(@Query('userId') userId?: string): Promise<RechargeResponseDto[]> {
    return this.listRechargesUseCase.execute(userId);
  }
}