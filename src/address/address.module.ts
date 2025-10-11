import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from './entities/address.entity';
import { AddressRepository } from './repositories/address.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { Logger } from 'shared/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository, ErrorHandler, Logger],
  exports: [AddressService, AddressRepository],
})
export class AddressModule {}

