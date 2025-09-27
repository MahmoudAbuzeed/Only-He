import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SignInDto } from "./dto/signin.dto";

@ApiTags('Authentication')
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with email or phone number. Either email or phone is required.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully created',
    example: {
      message: 'CREATED_SUCCESSFULLY',
      data: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        user_name: 'johndoe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or duplicate user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("signIn")
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email/phone and password. Returns JWT token for subsequent requests.'
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    example: {
      first_name: 'John',
      last_name: 'Doe',
      user_name: 'johndoe',
      email: 'john@example.com',
      phone: '+1234567890',
      id: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve list of all registered users (Admin only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users retrieved successfully',
    example: [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        user_name: 'johndoe',
        email: 'john@example.com',
        phone: '+1234567890',
        created_at: '2024-01-15T10:30:00Z'
      }
    ]
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve specific user information by user ID'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User found',
    example: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      user_name: 'johndoe',
      email: 'john@example.com',
      phone: '+1234567890',
      created_at: '2024-01-15T10:30:00Z'
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information by user ID'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    example: { message: 'UPDATED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Delete user account by user ID'
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    example: { message: 'DELETED_SUCCESSFULLY' }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
