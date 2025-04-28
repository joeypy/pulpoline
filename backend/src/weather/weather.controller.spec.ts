// src/weather/weather.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';

describe('WeatherController', () => {
  let controller: WeatherController;
  const mockService = {
    getWeatherByCity: jest.fn(),
    getAutocompleteByCity: jest.fn(),
    getFavorites: jest.fn(),
    createFavorites: jest.fn(),
    deleteFavorites: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        { provide: WeatherService, useValue: mockService },
        { provide: HttpService, useValue: {} },
        { provide: ConfigService, useValue: { get: () => 'x' } },
        { provide: RedisService, useValue: {} },
        { provide: getRepositoryToken(Favorite), useValue: {} },
      ],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
