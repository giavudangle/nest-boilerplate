import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenAuthenticationGuard } from '../../authentication/guards/jwt-access-token-authentication.guard';
import IRequestWithUser from '../../authentication/interfaces/request-with-user.interface';
import {LocalFilesInterceptor} from '../../shared/interceptors/local-file.interceptor';
import { editFileName, imageFileFilter } from '../../shared/utils/file-uploading.utils';
import { UploadAvatarUserDto } from '../dtos/upload-avatar-user.dto';
import { UserService } from './users.service';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    ) {}

  @Post('avatar')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAccessTokenAuthenticationGuard)

  @UseInterceptors(LocalFilesInterceptor({
    fieldName:'avatar',
    limits:{fileSize:Math.pow(1024,3)},
    fileFilter:imageFileFilter,
    fileName:editFileName
  }))
  async uploadAvatar(@Req() request : IRequestWithUser,@Body() uploadDto : UploadAvatarUserDto,@UploadedFile() avatarImage : Express.Multer.File){
    return this.userService.addAvatar(request.user.id,{
      filename:avatarImage.filename,
      path:avatarImage.path,
      mimetype:avatarImage.mimetype
    })
  }

}
