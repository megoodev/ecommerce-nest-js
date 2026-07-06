import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { DatabaseService } from 'src/database/database.service';
import { AppResponse, TaxData } from 'src/utils/types';

@Injectable()
export class TaxService {
  constructor(private readonly datbaseService: DatabaseService) {}
  async createOrUpdate(
    createTaxDto: CreateTaxDto,
  ): Promise<AppResponse<TaxData>> {
    const ex = await this.datbaseService.tax.findFirst();
    if (ex) {
      const tax = await this.datbaseService.tax.update({
        where: {
          id: ex.id,
        },
        data: {
          ...createTaxDto,
        },
      });
      return {
        status: 200,
        message: 'Taxes updated successfully',
        data: tax,
      };
    }
    const tax = await this.datbaseService.tax.create({
      data: {
        ...createTaxDto,
      },
    });
    return {
      status: 201,
      message: 'Taxes created successfully',
      data: tax,
    };
  }

  async find(): Promise<AppResponse<TaxData>> {
    const tax = await this.datbaseService.tax.findFirst();

    if (!tax) {
      throw new NotFoundException('Taxes not found');
    }
    return {
      status: 200,
      message: 'Taxes found',
      data: tax,
    };
  }

  async reSet(): Promise<AppResponse<TaxData>> {
    const tex = await this.datbaseService.tax.findFirst();
    const updatedTax = await this.datbaseService.tax.update({
      where: {
        id: tex.id,
      },
      data: {
        shipingTax: 0,
        taxPrice: 0,
      },
    });
    return {
      status: 200,
      message: 'Taxes reset successfully',
      data: updatedTax,
    };
  }
}
