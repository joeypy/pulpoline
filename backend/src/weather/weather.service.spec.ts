// src/weather/weather.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../common/redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { of } from 'rxjs';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: Partial<Record<keyof HttpService, jest.Mock>>;
  let redisService: Partial<Record<keyof RedisService, jest.Mock>>;
  let favRepo: Partial<Record<keyof any, jest.Mock>>;

  beforeEach(async () => {
    httpService = { get: jest.fn() };
    redisService = { get: jest.fn(), set: jest.fn() };
    favRepo = {
      create: jest.fn((dto) => dto),
      save: jest.fn((ent) => Promise.resolve({ id: 'fav-1', ...ent })),
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
    it('fetches, maps and caches data, then returns cache on second call', async () => {
      (redisService.get as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(
          JSON.stringify({
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
          }),
        );

      (httpService.get as jest.Mock).mockReturnValueOnce(
        of({
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
        }),
      );

      const first = await service.getWeatherByCity('TestCity');
      expect(httpService.get).toHaveBeenCalledWith(
        'http://api.weatherapi.com/v1/current.json',
        { params: { key: 'API_KEY', q: 'TestCity' } },
      );
      expect(redisService.set).toHaveBeenCalledWith(
        'weather:testcity',
        JSON.stringify(first),
        600,
      );

      const second = await service.getWeatherByCity('TestCity');
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(second).toEqual(first);
    });
  });

  describe('getAutocompleteByCity', () => {
    it('fetches, maps and caches suggestions, then returns cache', async () => {
      (redisService.get as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(JSON.stringify(['A, R1, C1', 'B, C2']));

      (httpService.get as jest.Mock).mockReturnValueOnce(
        of({
          data: [
            { name: 'A', region: 'R1', country: 'C1' },
            { name: 'B', region: '', country: 'C2' },
          ],
        }),
      );

      const first = await service.getAutocompleteByCity('A');
      expect(first).toEqual(['A, R1, C1', 'B, C2']);
      expect(redisService.set).toHaveBeenCalledWith(
        'autocomplete:a',
        JSON.stringify(first),
        3600,
      );

      const second = await service.getAutocompleteByCity('A');
      expect(httpService.get).toHaveBeenCalledTimes(1);
      expect(second).toEqual(first);
    });
  });

  describe('createFavorites & deleteFavorites', () => {
    const userId = 'user-123';
    it('creates a favorite with city and userId', async () => {
      const fav = await service.createFavorites(userId, { city: 'TestCity' });
      expect(favRepo.create).toHaveBeenCalledWith({ city: 'TestCity', userId });
      expect(favRepo.save).toHaveBeenCalled();
      expect(fav).toEqual({ id: 'fav-1', city: 'TestCity', userId });
    });

    it('deletes only the favorite of that user', async () => {
      await service.deleteFavorites(userId, 'fav-1');
      expect(favRepo.delete).toHaveBeenCalledWith({ id: 'fav-1', userId });
    });
  });
});
