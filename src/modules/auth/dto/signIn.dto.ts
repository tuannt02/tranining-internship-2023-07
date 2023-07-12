import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  NotContains,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ')
  password: string;
}
