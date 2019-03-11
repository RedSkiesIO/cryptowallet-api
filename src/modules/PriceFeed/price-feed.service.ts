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
import { PriceFeed } from './interfaces/price-feed.interface';
import { PriceFeedDto } from './dto/price-feed.dto';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PriceFeedService extends AbstractService<PriceFeed, PriceFeedDto> {
  constructor(@InjectModel('PriceFeed') protected readonly model: Model<PriceFeed>, private readonly configService: ConfigService) {
    super();
  }

  async fetchExternalApi(code: string): Promise<any> {
    const supportedCurrencies = this.configService.get('CURRENCIES').split(',');
    const cryptoCompareKey = this.configService.get('CRYPTO_COMPARE_KEY');
    const cryptoCompareURL = this.configService.get('CRYPTO_COMPARE_URL');
    const URL = `${cryptoCompareURL}/data/pricemultifull?fsyms=${code}&tsyms=${supportedCurrencies}&api_key=${cryptoCompareKey}`;

    try {
      const response: any = await axios.get(URL);

      if (response.status !== 200) {
        throw new HttpException(`Internal Server Error.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (response.data.Response && response.data.Response === 'Error') {
        throw new HttpException(`Internal Server Error. ${response.Response.Message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return response;
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
