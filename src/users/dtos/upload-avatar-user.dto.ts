import { ApiProperty } from "@nestjs/swagger";

export class UploadAvatarUserDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
    })
    avatar: any;
}