// src/weather/weather.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RedisService } from '../common/redis/redis.service';
import { Favorite } from './entities/favorite-weather.entity';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { IConfig } from 'src/common/config/config.interface';
import { WeatherData } from './dto/weather-data.dto';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService<IConfig>,
    private readonly redis: RedisService,
    @InjectRepository(Favorite)
    private readonly favRepo: Repository<Favorite>,
  ) {
    this.apiKey = this.config.get<string>('WEATHER_API_KEY') || '';
    if (!this.apiKey) {
      throw new HttpException(
        'WEATHER_API_KEY not set',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** Autocomplete: cache + WeatherAPI search */
  async getAutocompleteByCity(query: string): Promise<string[]> {
    const key = `autocomplete:${query.toLowerCase()}`;
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const resp = await firstValueFrom(
        this.http.get('http://api.weatherapi.com/v1/search.json', {
          params: { key: this.apiKey, q: query },
        }),
      );
      const cities: string[] = resp.data.map((i: any) => i.name);
      await this.redis.set(key, JSON.stringify(cities), 3600);
      return cities;
    } catch (err) {
      throw new HttpException(
        'Error fetching autocomplete',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /** Current weather: cache + WeatherAPI current.json */
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const key = `weather:${city.toLowerCase()}`;
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const resp = await firstValueFrom(
        this.http.get('http://api.weatherapi.com/v1/current.json', {
          params: { key: this.apiKey, q: city },
        }),
      );
      const d = resp.data;
      const data: WeatherData = {
        name: d.location.name,
        temp_c: d.current.temp_c,
        temp_f: d.current.temp_f,
        condition: d.current.condition.text,
        icon: d.current.condition.icon,
        wind_kph: d.current.wind_kph,
        humidity: d.current.humidity,
        localtime: d.location.localtime,
      };
      await this.redis.set(key, JSON.stringify(data), 600);
      return data;
    } catch (err) {
      throw new HttpException(
        'Error fetching weather data',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /** Postgres Favorites CRUD */
  async getFavorites(): Promise<Favorite[]> {
    return this.favRepo.find();
  }

  async createFavorites(dto: CreateWeatherDto): Promise<Favorite> {
    const fav = this.favRepo.create({ city: dto.city });
    return this.favRepo.save(fav);
  }

  async deleteFavorites(id: string): Promise<void> {
    await this.favRepo.delete(id);
  }
}
