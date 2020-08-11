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
import { Controller, Get, Req, Param, UseGuards, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { PriceFeedService } from '../price-feed.service';
import { PriceFeedDto } from '../dto/price-feed.dto';
import { PriceFeedGuard } from '../guards/price-feed.guard';
import { PriceFeed } from '../interfaces/price-feed.interface';
import { DTO } from '../interfaces/dto.interface';
import { PriceFeedData, PriceFeedDataInterfaceKeys } from '../interfaces/price-feed-data.interface';
import { JwtAuthGuard } from '../../Auth/guards/jwt-auth.guard';
import { AuthResponseInterceptor } from '../../Auth/interceptors/auth-response.interceptor';

const bugsnagClient = bugsnag({
  apiKey: envConfig.BUGSNAG_KEY,
  logger: null,
});
@Controller('price-feed')
@UseGuards(PriceFeedGuard)
export class PriceFeedController {
  private readonly priceFeedService: PriceFeedService;
  private readonly configService: ConfigService;

  constructor(priceFeedService: PriceFeedService, configService: ConfigService) {
    this.priceFeedService = priceFeedService;
    this.configService = configService;
  }

  /**
   * Filters out not needed currecny data
   * @param  {any}    data                full data that went into DB as cache
   * @param  {[type]} currenciesToInclude list of currencies that were requested
   * @return {object}
   */
  filterOutCurrencies(data: object, currenciesToInclude: string[]): object {
    for (const key in data) {
      if (key !== 'code' && key !== 'timestamp') {
        if (!currenciesToInclude.includes(key)) {
          delete data[key];
        }
      }
    }

    return data;
  }

  /**
   * Returns the price feed data either from the DB
   * or from the API
   * @param  {string}       code the coin code
   * @return {Promise<any>}
   */
  async getCoinData(code: string, requestedCurrencies: string[]): Promise<any> {
    const supportedCurrencies = this.configService.get('CURRENCIES').split(',');

    const excludeCurrencies: object = { _id: 0, __v: 0 };
    if (requestedCurrencies[0] !== 'ALL') {
      supportedCurrencies.forEach((currency: string) => {
        if (!requestedCurrencies.includes(currency)) {
          excludeCurrencies[currency] = 0;
        }
      });
    }

    const result = await this.priceFeedService.findOne({ code }, excludeCurrencies) as [];
    if (result) {
      return result;
    }
    const oldApi = new RegExp('^[A-Z]{0,10}$').test(code);

    const response = await this.priceFeedService.fetchExternalApi(code, oldApi);
    const timestamp = Math.round(+new Date() / 1000);

    const dtoRaw: Partial<DTO> = {
      code,
      timestamp,
    };
    if (!oldApi) {
    supportedCurrencies.forEach((currency) => {
      const fiat = currency.toLowerCase();
      const filtered = {
        TOTALVOLUME24HOURTO: response.data[code][`${fiat}_24h_vol`],
        PRICE: response.data[code][fiat],
        CHANGEPCT24HOUR: response.data[code][`${fiat}_24h_change`],
        MKTCAP: response.data[code][`${fiat}_market_cap`],
      };
     
      dtoRaw[currency] = filtered;
    });
   } else {
    supportedCurrencies.forEach((currency) => {
      const filtered = {};
      PriceFeedDataInterfaceKeys.forEach((key) => {
        filtered[key] = response.data.RAW[code][currency][key];
      });

      dtoRaw[currency] = filtered;
    });
  }

    

    const dto = new PriceFeedDto(dtoRaw);
    await this.priceFeedService.create(dto);

    if (requestedCurrencies[0] === 'ALL') {
      return dto;
    }

    return this.filterOutCurrencies(dto, requestedCurrencies);
  }

  // @UseInterceptors(AuthResponseInterceptor)

  /**
   * The API endpoint, composes an array of promises that fetch
   * the data and resolves them
   * @param  {object}       @Req()   request       contains all the request details
   * @param  {object}       @Param() params        contains all the request parameters
   * @return {Promise<Array>}
   */
  @Get(':coin/:currency')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AuthResponseInterceptor)
  async fetchData(@Req() request, @Param() params): Promise<any> {
    const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
    const requestedCoins = params.coin.split(',');
    const requestedCurrencies = params.currency.split(',');

    const promises: [Promise<void>] = requestedCoins.map((coin: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const coinData = await this.getCoinData(coin, requestedCurrencies);
          resolve(coinData);
        } catch (err) {
          reject(err);
        }
      });
    });

    try {
      return await Promise.all(promises);
    } catch (err) {
      bugsnagClient.notify(err);
      throw new HttpException(`Internal Server Error. ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
