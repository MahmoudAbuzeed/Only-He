import { Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

import { AddressRepo } from "./address.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { CREATED_SUCCESSFULLY, DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY } from "messages";

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepo, private readonly errorHandler: ErrorHandler) {}

  async create(createAddressDto: CreateAddressDto) {
    try {
      await this.addressRepo.create(createAddressDto);
      return { message: CREATED_SUCCESSFULLY };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll() {
    try {
      return await this.addressRepo.findAll();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number) {
    const address = await this.addressRepo.findOne(id);
    if (!address) throw this.errorHandler.notFound();
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const updatedAddress = await this.addressRepo.update(id, updateAddressDto);
    if (updatedAddress.affected == 0) throw this.errorHandler.notFound();
    return { message: UPDATED_SUCCESSFULLY };
  }

  async remove(id: number) {
    const deletedAddress = await this.addressRepo.remove(+id);
    if (deletedAddress.affected == 0) throw this.errorHandler.notFound();
    return { message: DELETED_SUCCESSFULLY };
  }
}
