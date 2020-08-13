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
import { FeeEstimate } from './interfaces/fee-estimate.interface';
import { FeeEstimateDto } from './dto/fee-estimate.dto';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class FeeEstimateService extends AbstractService<FeeEstimate, FeeEstimateDto> {
  constructor(@InjectModel('FeeEstimate') protected readonly model: Model<FeeEstimate>, private readonly configService: ConfigService) {
    super();
  }

  async fetchExternalApi(code: string): Promise<any> {
    const supportedCodes = ['btc', 'ltc', 'dash'];
    
    try {
    if(code.toLowerCase() === 'eth') {
      const response: any = await axios.get(this.configService.get('ETHGASSTATION_URL'));
      const gweiToWei = (val: any) => {
        return val * (10 ** 9);
      };

      if (response.status !== 200) {
        let error = response.error;
        if (!error) {
          error = response.body;
        }
        throw new HttpException(`Internal Server Error. ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        high: gweiToWei((response.data.fast / 10) * 1.1),
        medium: gweiToWei((response.data.average / 10)  * 1.1),
        low: gweiToWei((response.data.safeLow / 10)  * 1.1)
      }
    }
    else if (supportedCodes.includes(code.toLowerCase())) {
    const blockcypherToken = this.configService.get('BLOCKCYPHER_TOKEN');
    const blockcypherURL = this.configService.get('BLOCKCYPHER_URL');
    const URL = `${blockcypherURL}/v1/${code.toLowerCase()}/main?token=${blockcypherToken}`;

    
      const response: any = await axios.get(URL);

      if (response.status !== 200) {
        let error = response.error;
        if (!error) {
          error = response.body;
        }
        throw new HttpException(`Internal Server Error. ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const data = {
        high: response.data.high_fee_per_kb,
        medium: response.data.medium_fee_per_kb,
        low: response.data.low_fee_per_kb,
      };

      if (code === 'ETH') {
        data.high = response.data.high_gas_price;
        data.medium = response.data.medium_gas_price;
        data.low = response.data.low_gas_price;
      }

      return data;
    }

      return {
        high: 10000000000,
        medium: 5000000000,
        low: 1000000000,
      };
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
