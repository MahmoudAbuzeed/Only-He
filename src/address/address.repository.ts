import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

import { Address } from './entities/address.entity';

@Injectable()
export class AddressRepo {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    return await this.addressRepository.save(createAddressDto);
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  async findOne(id: number) {
    return await this.addressRepository.findOne(id);
  }

  async update(id: number, updateRoleDto: UpdateAddressDto) {
    return await this.addressRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return await this.addressRepository.delete({ id });
  }
}
