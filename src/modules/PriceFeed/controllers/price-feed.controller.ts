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

import axios from 'axios';
import { Controller, Get, Req, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { PriceFeedService } from '../price-feed.service';
import { PriceFeedDto } from '../dto/price-feed.dto';
import { PriceFeedGuard } from '../guards/price-feed.guard';
import { PriceFeed } from '../interfaces/price-feed.interface';
import { DTO } from '../interfaces/dto.interface';
import { PriceFeedData, PriceFeedDataInterfaceKeys } from '../interfaces/price-feed-data.interface';

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
      if (key !== 'code') {
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
   *
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

    const cryptoCompareKey = this.configService.get('CRYPTO_COMPARE_KEY');
    const cryptoCompareURL = this.configService.get('CRYPTO_COMPARE_URL');
    const URL = `${cryptoCompareURL}/data/pricemultifull?fsyms=${code}&tsyms=${supportedCurrencies}&api_key=${cryptoCompareKey}`;

    const response: any = await axios.get(URL);

    if (response.Response && response.Repsonse === 'Error') {
      throw new HttpException(`Internal Server Error. ${response.Repsonse.Message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const dtoRaw: Partial<DTO> = { code };

    supportedCurrencies.forEach((currency) => {
      const filtered = {};
      PriceFeedDataInterfaceKeys.forEach((key) => {
        filtered[key] = response.data.RAW[code][currency][key];
      });

      dtoRaw[currency] = filtered;
    });

    const dto = new PriceFeedDto(dtoRaw);
    await this.priceFeedService.create(dto);

    if (requestedCurrencies[0] === 'ALL') {
      return dto;
    }

    return this.filterOutCurrencies(dto, requestedCurrencies);
  }

  /**
   * The API endpoint, composes an array of promises that fetch
   * the data and resolves them
   *
   * @param  {object}       @Req()   request       contains all the request details
   * @param  {object}       @Param() params        contains all the request parameters
   * @return {Promise<Array>}
   */
  @Get(':coin/:currency')
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
      throw new HttpException(`Internal Server Error. ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
