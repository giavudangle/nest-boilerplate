import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocalFilesController } from "./local-file.controller";
import { LocalFile } from "./local-file.entity";
import { LocalFilesService } from "./local-file.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([LocalFile]),
        ConfigModule
    ],
    providers:[LocalFilesService],
    exports:[LocalFilesService],
    controllers:[LocalFilesController]
})
export class LocalFilesModule{}