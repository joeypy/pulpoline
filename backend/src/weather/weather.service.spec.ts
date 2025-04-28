// src/weather/weather.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { of } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: Partial<Record<keyof HttpService, jest.Mock>>;
  let redisService: Partial<Record<keyof RedisService, jest.Mock>>;
  let favRepo: Partial<Record<keyof Repository<Favorite>, jest.Mock>>;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };
    redisService = {
      get: jest.fn(),
      set: jest.fn(),
    };
    favRepo = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: { get: () => 'API_KEY' } },
        { provide: RedisService, useValue: redisService },
        { provide: getRepositoryToken(Favorite), useValue: favRepo },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  describe('getWeatherByCity', () => {
    it('should fetch, map and cache weather data', async () => {
      // Redis miss
      (redisService.get as jest.Mock).mockResolvedValueOnce(null);

      // Mock API response
      const apiResponse = {
        data: {
          location: {
            name: 'TestCity',
            region: 'TestRegion',
            country: 'TestCountry',
            localtime: '2025-04-28 10:00',
          },
          current: {
            temp_c: 20,
            temp_f: 68,
            condition: { text: 'Sunny', icon: '/icon.png' },
            wind_kph: 5,
            humidity: 60,
          },
        },
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of(apiResponse));

      const result = await service.getWeatherByCity('TestCity');

      expect(httpService.get).toHaveBeenCalledWith(
        'http://api.weatherapi.com/v1/current.json',
        { params: { key: 'API_KEY', q: 'TestCity' } },
      );
      expect(result).toEqual({
        name: 'TestCity',
        region: 'TestRegion',
        country: 'TestCountry',
        temp_c: 20,
        temp_f: 68,
        condition: 'Sunny',
        icon: '/icon.png',
        wind_kph: 5,
        humidity: 60,
        localtime: '2025-04-28 10:00',
      });
      // Cached
      expect(redisService.set).toHaveBeenCalledWith(
        'weather:testcity',
        JSON.stringify(result),
        600,
      );

      // On second call, should return from cache without HTTP
      (redisService.get as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(result),
      );
      const cached = await service.getWeatherByCity('TestCity');
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(cached).toEqual(result);
    });
  });

  describe('getAutocompleteByCity', () => {
    it('should fetch, map "City, Region, Country" and cache suggestions', async () => {
      (redisService.get as jest.Mock).mockResolvedValueOnce(null);

      const apiResponse = {
        data: [
          { name: 'A', region: 'R1', country: 'C1' },
          { name: 'B', region: '', country: 'C2' },
        ],
      };
      (httpService.get as jest.Mock).mockReturnValueOnce(of(apiResponse));

      const suggestions = await service.getAutocompleteByCity('A');
      expect(suggestions).toEqual(['A, R1, C1', 'B, C2']);
      expect(redisService.set).toHaveBeenCalledWith(
        'autocomplete:a',
        JSON.stringify(suggestions),
        3600,
      );

      // Cached path
      (redisService.get as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(suggestions),
      );
      const fromCache = await service.getAutocompleteByCity('A');
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(fromCache).toEqual(suggestions);
    });
  });

  describe('createFavorites & deleteFavorites', () => {
    const userId = 'user-123';
    beforeEach(() => {
      favRepo.create!.mockImplementation((dto) => ({ id: undefined, ...dto }));
      favRepo.save!.mockImplementation((ent) =>
        Promise.resolve({ id: 'fav-1', ...ent }),
      );
    });

    it('should create a favorite with given city and userId', async () => {
      const dto = { city: 'TestCity' };
      const fav = await service.createFavorites(userId, dto as any);
      expect(favRepo.create).toHaveBeenCalledWith({ city: 'TestCity', userId });
      expect(favRepo.save).toHaveBeenCalled();
      expect(fav).toEqual({ id: 'fav-1', city: 'TestCity', userId });
    });

    it('should delete only the favorite of that user', async () => {
      await service.deleteFavorites(userId, 'fav-1');
      expect(favRepo.delete).toHaveBeenCalledWith({ id: 'fav-1', userId });
    });
  });
});
