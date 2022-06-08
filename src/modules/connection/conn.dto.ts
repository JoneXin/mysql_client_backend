import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  IsPort,
  IsIP,
} from 'class-validator';

export class ConnMysqlDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  connection_name: string;

  @IsString()
  @IsIP()
  host: string;

  @IsPort()
  port: string;

  @IsString()
  user: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class DelConnDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  connection_name: string;
}

export class UpdateConnDto extends ConnMysqlDto {
  @IsInt()
  uid: number;
}
