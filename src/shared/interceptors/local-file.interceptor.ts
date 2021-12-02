import { Injectable, mixin, NestInterceptor, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { editFileName } from "../utils/file-uploading.utils";

interface ILocalFilesInterceptorOptions {
    fieldName: string;
    path?:string;
    limits: MulterOptions['limits'],
    fileFilter?:MulterOptions['fileFilter'];
    fileName?: any
    
}

export function LocalFilesInterceptor(options : ILocalFilesInterceptorOptions) : Type<NestInterceptor>{
    @Injectable()
    class Interceptor implements NestInterceptor {
        localFilesInterceptor: NestInterceptor;
        constructor(configService : ConfigService){
            // const filesDestination = configService.get('UPLOADED_FILES_DESTINATION')
            // const destination = `${filesDestination}${options.path}`
            console.log(configService.get('UPLOADED_FILES_DESTINATION'))

            const multerOptions : MulterOptions = {
                storage:diskStorage({
                    destination:configService.get('UPLOADED_FILES_DESTINATION'),
                    filename:options.fileName
                }),
                fileFilter:options.fileFilter,
                limits:options.limits
            }
            this.localFilesInterceptor = new (FileInterceptor(options.fieldName,multerOptions))
        }
        intercept(...args:Parameters<NestInterceptor['intercept']>){
            
            return this.localFilesInterceptor.intercept(...args)
        }
    }
    return mixin(Interceptor)
}

