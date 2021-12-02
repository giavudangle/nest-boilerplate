import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
