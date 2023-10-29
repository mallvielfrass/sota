import { Optional } from '@nestjs/common';

export class UserDto {
  @Optional()
  firstName?: string;
  @Optional()
  lastName?: string;
}
export class UserResponse {
  email: string;
  // hash: string;
  username: string;
  firstName: string;
  lastName: string;
  isDeleted: boolean;
  isBanned: boolean;
  _id: string;
}
