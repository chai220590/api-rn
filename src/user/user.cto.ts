import { ApiProperty } from '@nestjs/swagger';

export class LoginInfoCTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class CreateUserCTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class ChangePasswordCTO {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
