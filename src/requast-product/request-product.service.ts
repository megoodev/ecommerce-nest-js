import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { type UUID } from 'crypto';
import {
  AppResponse,
  JwtPayloadType,
  RequestProductWithUser,
} from 'src/utils/types';
import { UserRole } from 'src/utils/enum';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequastProductDto } from './dto/update-request-product.dto';
import { RequestProduct } from 'generated/prisma/client';

@Injectable()
export class RequestProductService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(
    createRequestProductDto: CreateRequestProductDto,
    userId: UUID,
  ): Promise<AppResponse<RequestProductWithUser>> {
    const exReqPro = await this.databaseService.requestProduct.findFirst({
      where: {
        titleNeed: createRequestProductDto.titleNeed,
        userId: userId,
      },
    });
    if (exReqPro) {
      throw new ConflictException('Request product alredy exsting');
    }
    const reqPro = await this.databaseService.requestProduct.create({
      data: {
        ...createRequestProductDto,
        userId: userId,
      },
      select: {
        id: true,
        titleNeed: true,
        detailes: true,
        qauntity: true,
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
          },
        },
      },
    });
    // const newData = {
    //   ...reqPro,
    //   user: {
    //     ...reqPro.user,
    //     role: reqPro.user.role,
    //   },
    // };
    return {
      status: 201,
      message: 'Request Product Created successfully',
      data: reqPro,
    };
  }
  async findAll(
    user: JwtPayloadType,
  ): Promise<AppResponse<RequestProductWithUser[]>> {
    let reqProducts: RequestProductWithUser[];
    if (user.role === UserRole.admin) {
      reqProducts = await this.databaseService.requestProduct.findMany({
        select: {
          id: true,
          titleNeed: true,
          detailes: true,
          qauntity: true,
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              active: true,
            },
          },
        },
      });
    }
    if (user.role === UserRole.user) {
      reqProducts = await this.databaseService.requestProduct.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          titleNeed: true,
          detailes: true,
          qauntity: true,
          category: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              active: true,
            },
          },
        },
      });
    }

    return {
      status: 200,
      message: 'Request products found',
      isEmpty: reqProducts.length === 0,
      length: reqProducts.length,
      data: reqProducts,
    };
  }

  async findOne(
    id: UUID,
    user: JwtPayloadType,
  ): Promise<AppResponse<RequestProduct>> {
    const reqPro = await this.databaseService.requestProduct.findUnique({
      where: {
        id,
      },
    });
    if (!reqPro && user.role !== UserRole.admin) {
      throw new UnauthorizedException();
    }
    if (reqPro && reqPro.userId !== user.id && user.role !== UserRole.admin) {
      throw new UnauthorizedException();
    }
    if (!reqPro) {
      throw new NotFoundException();
    }

    return {
      status: 200,
      message: 'Request product found',
      data: reqPro,
    };
  }

  async update(
    id: UUID,
    user: JwtPayloadType,
    updateRequestProductDto: UpdateRequastProductDto,
  ): Promise<AppResponse<RequestProductWithUser>> {
    const reqProduct = await this.databaseService.requestProduct.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!reqProduct) {
      throw new NotFoundException('Request product not found');
    }
    const updatedReq = await this.databaseService.requestProduct.update({
      where: {
        id,
      },
      data: { ...updateRequestProductDto },
      select: {
        id: true,
        titleNeed: true,
        detailes: true,
        qauntity: true,
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: 'Updated request product successfully',
      data: updatedReq,
    };
  }

  async remove(id: UUID, user: JwtPayloadType) {
    const exReqPro = await this.databaseService.requestProduct.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!exReqPro) {
      throw new NotFoundException('Request product not found');
    }
    await this.databaseService.requestProduct.delete({
      where: {
        id,
        userId: user.id,
      },
    });
  }
}
