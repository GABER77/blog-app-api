import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import {
  SwaggerGetAllUsers,
  SwaggerGetUser,
  SwaggerUpdateUser,
} from 'src/common/swagger/users.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/upload/multer-options';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SwaggerGetAllUsers()
  public getAllUsers(@Query() query: Record<string, string>) {
    return this.userService.getAllUsers(query);
  }

  @Get(':id')
  @SwaggerGetUser()
  async getUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @SwaggerUpdateUser()
  public updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch(':id/profile-image')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  // when do swagger, mentions that the content type is multipart/form-data
  async updateProfileImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, any>,
  ) {
    // Check if an image was provided
    if (!file) {
      throw new BadRequestException('Please provide profile image');
    }

    // Prevent any additional fields in the body
    if (Object.keys(body).length > 0) {
      throw new BadRequestException('Extra fields are not allowed');
    }

    // Call the service to handle image upload and return the entire user
    return this.userService.updateProfileImage(id, file);
  }
}
