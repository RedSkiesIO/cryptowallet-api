// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part cryptowallet-api <https://github.com/atlascity/cryptowallet-api>.
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
import { AbstractService } from '../../abstract/AbstractService';
import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PriceHistory } from './interfaces/price-history.interface';
import { PriceHistoryDto } from './dto/price-history.dto';
import { ConfigService } from '../../config/config.service';

const CoinGecko = require('coingecko-api');

const coinGecko = new CoinGecko();

@Injectable()
export class PriceHistoryService extends AbstractService<PriceHistory, PriceHistoryDto> {
  constructor(@InjectModel('PriceHistory') protected readonly model: Model<PriceHistory>, private readonly configService: ConfigService) {
    super();
  }


  async fetchExternalApi(code: string, currency: string, period: string): Promise<any> {
    let days;

    switch (period) {
      case 'day':
        days = 1;
        break;

      case 'week':
       days = 7;
        break;

      case 'month':
        days = 30;
        break;

      default:
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const isERC20 = new RegExp('^0x[a-fA-F0-9]{40}$').test(code);
    const apiCall = isERC20 ? 'fetchCoinContractMarketChart' : 'fetchMarketChart';
    try {
      const params: any = {
        days,
        vs_currencies: currency,
    }
    
      const response = await coinGecko.coins[apiCall](code.toLowerCase(), isERC20 ? 'ethereum' : params, isERC20 ? params : null);

      if (response.code !== 200) {
        throw new HttpException(`Internal Server Error.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (!response.data || !response.data.prices) {
        throw new HttpException(`Internal Server Error. No data returned`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return response.data.prices.map((price) => {
        return {
          t: price[0],
          y: price[1],
        }
      });
    } catch (err) {
      if (err.response) {
        throw new Error(`External API: ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`External API: no response received`);
      } else {
        throw new Error(err.message);
      }
    }
  }
}
