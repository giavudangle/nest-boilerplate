import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt'
import { ILocalFileDto } from '../../local-files/dtos/local-file.dto';
import { LocalFile } from '../../local-files/core/local-file.entity';
import { LocalFilesService } from '../../local-files/core/local-file.service';
import { PublicFileService } from '../../public-files/core/public-file.service';
@Injectable()
export class UserService {
  constructor(
    @Inject(LocalFilesService) private readonly localFilesService: LocalFilesService,
    @Inject(PublicFileService) private readonly publicFilesService: PublicFileService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectConnection() private readonly connection : Connection
  ) { }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    return null;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    // Override the old refresh token to get the lastest refresh token
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    })
    return true;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId)

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)

    if (isRefreshTokenMatching) {
      return user;
    }

  }

  async removeRefreshToken(userId:number){
    return this.userRepository.update(userId,{
      currentHashedRefreshToken:null
    })
  }

  async addAvatar(userId: number, fileData: ILocalFileDto) {
    const avatar = await this.localFilesService.saveLocalFileData(fileData)
    await this.userRepository.update(userId, {
      avatarId: avatar.id
    })
  }

  // Delete avatar
  // -> Get avatar path 
  // -> Delete avatar blog saved from database
  // -> Also delete in static (public/assets/images)
  // -> Update avatar id to null
  async deleteAvatar(userId:number) {
    const queryRunner = this.connection.createQueryRunner()
    const user = await this.getById(userId)
    const fileId = user.avatar?.id 
    if(fileId){
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.update(User,userId,{
          ...user,
          avatar:null
        })
        await this.publicFilesService.deletePublicFile(fileId)
        await queryRunner.commitTransaction();
      } catch(error){
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException();
      } finally {
        await queryRunner.release();
      }
    }
  }

}
