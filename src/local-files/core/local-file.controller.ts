import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Res, StreamableFile, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import { LocalFilesService } from "./local-file.service";

@ApiTags('Local File API')
@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export class LocalFilesController{
    constructor(
        private readonly localFilesService: LocalFilesService
      ) {}
      @Get(':id')
      async getDatabaseFileById(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) response: Response) {
        const file = await this.localFilesService.getFileById(id);
    
        const stream = createReadStream(join(process.cwd(), file.path));
    
        response.set({
          'Content-Disposition': `inline; filename="${file.filename}"`,
          'Content-Type': file.mimetype
        })
        return new StreamableFile(stream);
      }
}