import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsPort,
  IsIP,
} from 'class-validator';

export class DelConnDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  connection_name: string;
}
