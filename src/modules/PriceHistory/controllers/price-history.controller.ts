// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part of cryptowallet-api <https://github.com/atlascity/cryptowallet-api>.
//
// cryptowallet-api is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
//
// cryptowallet-api is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with cryptowallet-api.  If not, see <http://www.gnu.org/licenses/>.

import bugsnag from '@bugsnag/js';
import envConfig from '../../../config/envConfig';
import { Controller, Get, Req, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { PriceHistoryService } from '../price-history.service';
import { PriceHistoryDto } from '../dto/price-history.dto';
import { PriceHistoryGuard } from '../guards/price-history.guard';
import { PriceHistory } from '../interfaces/price-history.interface';
import { DTO } from '../interfaces/dto.interface';

const bugsnagClient = bugsnag(envConfig.BUGSNAG_KEY);

@Controller('price-history')
@UseGuards(PriceHistoryGuard)
export class PriceHistoryController {
  private readonly priceHistoryService: PriceHistoryService;
  private readonly configService: ConfigService;

  constructor(priceHistoryService: PriceHistoryService, configService: ConfigService) {
    this.priceHistoryService = priceHistoryService;
    this.configService = configService;
  }

  /**
   * Either fetches cached data form the DB or
   * from the external API and puts it in the DB
   * @param  {string}       code
   * @param  {string}       currency
   * @param  {string}       period
   * @return {Promise<any>}
   */
  async getCoinData(code: string, currency: string, period: string): Promise<any> {
    const result = await this.priceHistoryService.findOne({ code, currency, period });
    if (result) {
      return result;
    }

    const response = await this.priceHistoryService.fetchExternalApi(code, currency, period);

    const dto = new PriceHistoryDto({
      code,
      currency,
      period,
      data: response.data.Data,
      timestamp: Math.round(+new Date() / 1000),
    });

    await this.priceHistoryService.create(dto);
    return dto;
  }

  /**
   * The API endpoint
   * @param  {Object}       @Req()   request       contains all the request details
   * @param  {Object}       @Param() params        contains all the request parameters
   * @return {Promise<any>}
   */
  @Get(':coin/:currency/:period')
  async fetchData(@Req() request, @Param() params): Promise<any> {
    try {
      return await this.getCoinData(params.coin, params.currency, params.period);
    } catch (err) {
      bugsnagClient.notify(err);
      throw new HttpException(`Internal Server Error. ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
