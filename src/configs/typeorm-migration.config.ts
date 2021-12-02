import { ConfigService } from '@nestjs/config';
import TypeOrmConfig from './typeorm.config';
export default TypeOrmConfig.getOrmConfig(new ConfigService());
