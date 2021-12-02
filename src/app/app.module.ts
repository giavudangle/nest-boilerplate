import * as Joi from '@hapi/joi';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthenticationModule } from '../authentication/core/authentication.module';
import { CategoriesModule } from '../categories/core/categories.module';
import { DatabaseModule } from '../database/database.module';
import { LocalFilesModule } from '../local-files/core/local-file.module';
import { PostsModule } from '../posts/core/posts.module';
import { PublicFileModule } from '../public-files/core/public-file.module';
import { SeedingService } from '../seedings/seeding.service';
import { Path } from '../shared/enums/path.enum';
import { UserModule } from '../users/core/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Database config module
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // Postgresl Validation Schema
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        // ==================================
        // JWT Validation Schema
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    // Multer Module
    MulterModule.register({
      dest: Path.IMAGE_STORAGE,
    }),
    // Server Static Module
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../public'),
    }),
    // Component modules
    PostsModule,
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    CategoriesModule,
    LocalFilesModule,
    PublicFileModule
  ],
  // Controller
  controllers: [AppController],
  // Providers injector
  providers: [SeedingService, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}
  async onApplicationBootstrap() {
    //await this.seedingService.seed();
    //console.log('[LOGCAT]', join(__dirname, '../../../public'));
  }
}
