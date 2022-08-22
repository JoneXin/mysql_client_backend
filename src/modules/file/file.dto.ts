import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsPort,
  IsIP,
} from 'class-validator';

export class FileDto {
  @IsString()
  path: string;
  root: boolean;
}
