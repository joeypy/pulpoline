// src/weather/dto/create-weather.dto.ts
import { IsString, MinLength } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  @MinLength(2)
  city: string;
}
