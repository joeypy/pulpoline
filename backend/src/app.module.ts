import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { PostgreModule } from './common/postgre/postgre.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './common/redis/redis.module';

import configuration from './common/config/config';
import { validationSchema } from './common/config/config.validation';
import { RedisService } from './common/redis/redis.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development'],
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    RedisModule,
    PostgreModule,
    WeatherModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
