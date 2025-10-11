import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@ApiBearerAuth('JWT-auth')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new address',
    description: 'Save a new address to your account for faster checkout',
  })
  @ApiBody({
    type: CreateAddressDto,
    examples: {
      home_address: {
        summary: 'Home Address Example',
        value: {
          label: 'Home',
          first_name: 'John',
          last_name: 'Doe',
          address_line_1: '123 Main Street',
          address_line_2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'United States',
          phone: '+1234567890',
          is_default_shipping: true,
          is_default_billing: true,
        },
      },
      work_address: {
        summary: 'Work Address Example',
        value: {
          label: 'Work',
          first_name: 'John',
          last_name: 'Doe',
          company: 'Acme Corp',
          address_line_1: '456 Business Blvd',
          city: 'New York',
          state: 'NY',
          postal_code: '10002',
          country: 'United States',
          phone: '+1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully',
    example: {
      success: true,
      message: 'Address created successfully',
      data: {
        id: 1,
        user_id: 1,
        label: 'Home',
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'United States',
        phone: '+1234567890',
        is_default_shipping: true,
        is_default_billing: true,
        created_at: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user?.id || 1;
    return this.addressService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all saved addresses',
    description: 'Retrieve all addresses saved by the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Addresses retrieved successfully',
    example: {
      success: true,
      message: 'Addresses retrieved successfully',
      data: [
        {
          id: 1,
          label: 'Home',
          first_name: 'John',
          last_name: 'Doe',
          address_line_1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'United States',
          is_default_shipping: true,
          is_default_billing: true,
          created_at: '2024-01-15T10:30:00.000Z',
        },
        {
          id: 2,
          label: 'Work',
          first_name: 'John',
          last_name: 'Doe',
          company: 'Acme Corp',
          address_line_1: '456 Business Blvd',
          city: 'New York',
          state: 'NY',
          postal_code: '10002',
          country: 'United States',
          is_default_shipping: false,
          is_default_billing: false,
          created_at: '2024-01-16T09:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    const userId = req.user?.id || 1;
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get address by ID',
    description: 'Retrieve a specific address by its ID',
  })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Address retrieved successfully',
    example: {
      success: true,
      message: 'Address retrieved successfully',
      data: {
        id: 1,
        label: 'Home',
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'United States',
        is_default_shipping: true,
        is_default_billing: true,
        created_at: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1;
    return this.addressService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update address',
    description: 'Update an existing address',
  })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiBody({
    type: UpdateAddressDto,
    examples: {
      update_label: {
        summary: 'Update Label',
        value: {
          label: 'Office',
        },
      },
      update_full: {
        summary: 'Update Full Address',
        value: {
          label: 'Home',
          address_line_1: '789 New Street',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Address updated successfully',
    example: {
      success: true,
      message: 'Address updated successfully',
    },
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const userId = req.user?.id || 1;
    return this.addressService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete address',
    description: 'Delete a saved address',
  })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Address deleted successfully',
    example: {
      success: true,
      message: 'Address deleted successfully',
    },
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1;
    return this.addressService.remove(userId, id);
  }

  @Patch(':id/set-default-shipping')
  @ApiOperation({
    summary: 'Set as default shipping address',
    description: 'Set this address as the default shipping address',
  })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Default shipping address updated',
    example: {
      success: true,
      message: 'Default shipping address updated',
    },
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setDefaultShipping(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1;
    return this.addressService.setDefaultShipping(userId, id);
  }

  @Patch(':id/set-default-billing')
  @ApiOperation({
    summary: 'Set as default billing address',
    description: 'Set this address as the default billing address',
  })
  @ApiParam({ name: 'id', description: 'Address ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Default billing address updated',
    example: {
      success: true,
      message: 'Default billing address updated',
    },
  })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setDefaultBilling(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.id || 1;
    return this.addressService.setDefaultBilling(userId, id);
  }
}

