import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
