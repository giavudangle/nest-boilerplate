import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '../../users/entities/address.entity';

export class RegisterDto {
  @ApiPropertyOptional()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;

  @ApiProperty({ type: () => Address })
  address: Address;
}
