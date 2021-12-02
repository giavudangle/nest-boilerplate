import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository } from "typeorm";
import { PublicFile } from "./public-file.entity";

@Injectable()
export class PublicFileService {
    constructor(
        @InjectRepository(PublicFile) private publicFilesRepository: Repository<PublicFile>,
        @Inject(ConfigService) private readonly configService: ConfigService
    ) { }
    // :))) I havent got a VISA Card so I can't do it lol
    // Recommend aws-sdk

    async uploadPublicFile(dataBuffer: Buffer, filename: string) {
        // Add upload to cloud here

    }
    async deletePublicFile(fileId: number) {

    }

    async deletePublicFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {

    }
}