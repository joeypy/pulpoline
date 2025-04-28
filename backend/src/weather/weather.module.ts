import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { RedisModule } from 'src/common/redis/redis.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
  imports: [TypeOrmModule.forFeature([Favorite]), HttpModule, RedisModule],
})
export class WeatherModule {}
