import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * GET /weather?city=London
   * Retorna el clima actual de la ciudad especificada
   */
  @Get()
  async getCityWeather(@Query('city') city: string) {
    if (!city) {
      throw new BadRequestException('City query parameter is required');
    }
    return this.weatherService.getWeatherByCity(city);
  }

  /**
   * GET /weather/autocomplete?query=Lon
   * Retorna sugerencias de nombres de ciudades
   */
  @Get('autocomplete')
  async getAutocomplete(@Query('query') query: string): Promise<string[]> {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }
    return this.weatherService.getAutocompleteByCity(query);
  }

  /**
   * GET /weather/favorites
   * Retorna todas las ciudades marcadas como favoritas
   */
  @Get('favorites')
  async getFavorites() {
    return this.weatherService.getFavorites();
  }

  /**
   * POST /weather/favorites
   * Agrega una nueva ciudad a favoritos
   */
  @Post('favorites')
  async createFavorite(@Body() createFavoriteDto: CreateWeatherDto) {
    return this.weatherService.createFavorites(createFavoriteDto);
  }

  /**
   * DELETE /weather/favorites/:id
   * Elimina una ciudad de favoritos por su ID
   */
  @Delete('favorites/:id')
  async deleteFavorite(@Param('id') id: string) {
    await this.weatherService.deleteFavorites(id);
    return { message: `Favorite with id ${id} deleted` };
  }
}
