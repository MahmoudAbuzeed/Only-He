import { Injectable } from '@nestjs/common';
import { AddressRepository } from './repositories/address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { ErrorHandler } from 'shared/errorHandler.service';
import { ResponseUtil } from '../common/utils/response.util';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly errorHandler: ErrorHandler,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto) {
    try {
      // If setting as default, clear other defaults first
      if (createAddressDto.is_default_shipping) {
        await this.addressRepository.clearDefaultShipping(userId);
      }
      if (createAddressDto.is_default_billing) {
        await this.addressRepository.clearDefaultBilling(userId);
      }

      const address = await this.addressRepository.create(userId, createAddressDto);

      return ResponseUtil.success('Address created successfully', address);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll(userId: number) {
    try {
      const addresses = await this.addressRepository.findAllByUser(userId);
      return ResponseUtil.success('Addresses retrieved successfully', addresses);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(userId: number, id: number) {
    try {
      const address = await this.addressRepository.findOne(id, userId);
      if (!address) {
        throw this.errorHandler.notFound({ message: 'Address not found' });
      }
      return ResponseUtil.success('Address retrieved successfully', address);
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOneRaw(userId: number, id: number): Promise<Address> {
    const address = await this.addressRepository.findOne(id, userId);
    if (!address) {
      throw this.errorHandler.notFound({ message: 'Address not found' });
    }
    return address;
  }

  async getDefaultShipping(userId: number): Promise<Address | null> {
    return await this.addressRepository.findDefaultShipping(userId);
  }

  async getDefaultBilling(userId: number): Promise<Address | null> {
    return await this.addressRepository.findDefaultBilling(userId);
  }

  async update(userId: number, id: number, updateAddressDto: UpdateAddressDto) {
    try {
      // Check if address exists
      const address = await this.addressRepository.findOne(id, userId);
      if (!address) {
        throw this.errorHandler.notFound({ message: 'Address not found' });
      }

      // If setting as default, clear other defaults first
      if (updateAddressDto.is_default_shipping) {
        await this.addressRepository.clearDefaultShipping(userId);
      }
      if (updateAddressDto.is_default_billing) {
        await this.addressRepository.clearDefaultBilling(userId);
      }

      await this.addressRepository.update(id, userId, updateAddressDto);

      return ResponseUtil.successNoData('Address updated successfully');
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async remove(userId: number, id: number) {
    try {
      const address = await this.addressRepository.findOne(id, userId);
      if (!address) {
        throw this.errorHandler.notFound({ message: 'Address not found' });
      }

      await this.addressRepository.remove(id, userId);

      return ResponseUtil.successNoData('Address deleted successfully');
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async setDefaultShipping(userId: number, id: number) {
    try {
      const address = await this.addressRepository.findOne(id, userId);
      if (!address) {
        throw this.errorHandler.notFound({ message: 'Address not found' });
      }

      await this.addressRepository.setDefaultShipping(id, userId);

      return ResponseUtil.successNoData('Default shipping address updated');
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async setDefaultBilling(userId: number, id: number) {
    try {
      const address = await this.addressRepository.findOne(id, userId);
      if (!address) {
        throw this.errorHandler.notFound({ message: 'Address not found' });
      }

      await this.addressRepository.setDefaultBilling(id, userId);

      return ResponseUtil.successNoData('Default billing address updated');
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }
}

