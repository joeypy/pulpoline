import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface JwtPayload {
  userId: string; // aquí Passport-JWT mete el userId
}

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getCityWeather(@Query('city') city: string) {
    if (!city)
      throw new BadRequestException('City query parameter is required');
    return this.weatherService.getWeatherByCity(city);
  }

  @Get('autocomplete')
  async getAutocomplete(@Query('query') query: string): Promise<string[]> {
    if (!query) throw new BadRequestException('Query parameter is required');
    return this.weatherService.getAutocompleteByCity(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Req() req: Request & { user: JwtPayload }) {
    return this.weatherService.getFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  async createFavorite(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: CreateWeatherDto,
  ) {
    console.log('req', req);
    return this.weatherService.createFavorites(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:id')
  async deleteFavorite(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
  ) {
    await this.weatherService.deleteFavorites(req.user.userId, id);
    return { message: `Favorite with id ${id} deleted` };
  }
}
