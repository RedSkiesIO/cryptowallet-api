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

import { Controller, Get, Req, Param, UseGuards } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { PriceFeedService } from '../price-feed.service';
import { PriceFeedDto } from '../dto/price-feed.dto';
import { PriceFeedGuard } from '../guards/price-feed.guard';

@Controller('price-feed')
@UseGuards(PriceFeedGuard)
export class PriceFeedController {
  private readonly priceFeedService: PriceFeedService;
  private readonly configService: ConfigService;

  constructor(priceFeedService: PriceFeedService, configService: ConfigService) {
    this.priceFeedService = priceFeedService;
    this.configService = configService;
  }

  @Get(':coin/:currency')
  async fetchData(@Req() request, @Param() params): Promise<any> {
    const currencies = this.configService.get('CURRENCIES').split(',');
    return { json: true };

    /* const result = await this.priceFeedService.findOne({ code: 'BTC' }, { _id: 0, __v: 0 });
    if (result) {
      return result;
    } else {
      return 'null';

      const cryptoCompareKek = '59e79cbecb93c903d32e1c5d5a5414863bf890a6636b0b6e2fd8c2b86c505df5';
      const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,LTC,ETH&tsyms=EUR,USD,GBP&api_key=${cryptoCompareKey}`;
      const response = await axios.get(URL);

      const dto = new PriceFeedDto({
        data,
        name: 'BTC',
        code: 'BTC',
      });

      await this.priceFeedService.create(dto);
    } */
  }
}
