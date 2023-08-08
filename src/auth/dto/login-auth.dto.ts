import { IsEmail, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
