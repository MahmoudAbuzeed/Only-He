import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(userId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      ...createAddressDto,
      user_id: userId,
    });
    return await this.addressRepository.save(address);
  }

  async findAllByUser(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { user_id: userId },
      order: { is_default_shipping: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: { id, user_id: userId },
    });
  }

  async findDefaultShipping(userId: number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: { user_id: userId, is_default_shipping: true },
    });
  }

  async findDefaultBilling(userId: number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: { user_id: userId, is_default_billing: true },
    });
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto): Promise<void> {
    await this.addressRepository.update({ id, user_id: userId }, updateAddressDto);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.addressRepository.delete({ id, user_id: userId });
  }

  async clearDefaultShipping(userId: number): Promise<void> {
    await this.addressRepository.update(
      { user_id: userId, is_default_shipping: true },
      { is_default_shipping: false },
    );
  }

  async clearDefaultBilling(userId: number): Promise<void> {
    await this.addressRepository.update(
      { user_id: userId, is_default_billing: true },
      { is_default_billing: false },
    );
  }

  async setDefaultShipping(id: number, userId: number): Promise<void> {
    // Clear current default
    await this.clearDefaultShipping(userId);
    // Set new default
    await this.addressRepository.update({ id, user_id: userId }, { is_default_shipping: true });
  }

  async setDefaultBilling(id: number, userId: number): Promise<void> {
    // Clear current default
    await this.clearDefaultBilling(userId);
    // Set new default
    await this.addressRepository.update({ id, user_id: userId }, { is_default_billing: true });
  }

  async count(userId: number): Promise<number> {
    return await this.addressRepository.count({ where: { user_id: userId } });
  }
}

