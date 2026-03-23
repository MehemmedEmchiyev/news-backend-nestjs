import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { NewsModule } from './modules/news/news.module';
import { UserModule } from './modules/users/user.module';
import { CommentModule } from './modules/comments/comment.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: config.databaseUrl,
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    JwtModule.register({
      global: true,
      secret: config.jwtSecter,
      signOptions: { expiresIn: '1d' }
    }),
    UserModule,
    AuthModule,
    NewsModule,
    CategoryModule,
    CommentModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
