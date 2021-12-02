import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { LocalFilesService } from '../../local-files/core/local-file.service';
import { LocalFile } from '../../local-files/core/local-file.entity';
import { PublicFileService } from '../../public-files/core/public-file.service';
import { PublicFile } from '../../public-files/core/public-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,LocalFile,PublicFile])],
  controllers: [UserController],
  providers: [UserService,ConfigService,LocalFilesService,PublicFileService],
  exports: [UserService],
})
export class UserModule {}
