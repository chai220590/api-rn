import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordCTO, CreateUserCTO, LoginInfoCTO } from './user.cto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User manager')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.getAll();
  }
  @Get(':userId')
  @Bind(Param('userId'))
  getUserById(userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post('/login')
  checkLogin(@Body() loginInfoCTO: LoginInfoCTO) {
    return this.userService.checkLogin(loginInfoCTO);
  }
  @Post('/register')
  register(@Body() createUserCTO: CreateUserCTO) {
    return this.userService.register(createUserCTO);
  }
  @Post('/refresh')
  @ApiBearerAuth()
  refreshToken() {
    return this.userService.refreshToken();
  }

  @Put('/changePassword')
  @ApiBearerAuth()
  changePassword(@Body() changePasswordCTO: ChangePasswordCTO) {
    return this.userService.changePassword(changePasswordCTO);
  }

  @Delete('/delete/:userId')
  @Bind(Param('userId'))
  delete(userId: string) {
    return this.userService.delete(userId);
  }
}
