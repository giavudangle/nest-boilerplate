import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ILocalFileDto } from "../dtos/local-file.dto";
import { LocalFile } from "./local-file.entity";

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private localFilesRepository: Repository<LocalFile>,
      ) {}
    async saveLocalFileData(fileData: ILocalFileDto) {
        const newFile = this.localFilesRepository.create(fileData)
        await this.localFilesRepository.save(newFile);
        return newFile;
      }
    
      async getFileById(fileId: number) {
        const file = await this.localFilesRepository.findOne(fileId);
        if (!file) {
          throw new NotFoundException();
        }
        return file;
      }
}