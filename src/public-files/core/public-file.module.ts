import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicFile } from "./public-file.entity";
import { PublicFileService } from "./public-file.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([PublicFile]),
        ConfigModule
    ],
    providers:[PublicFileService],
    exports:[PublicFileService]
})
export class PublicFileModule {
    
}