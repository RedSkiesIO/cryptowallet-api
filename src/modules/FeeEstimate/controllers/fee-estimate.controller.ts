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
import axios from 'axios';
import { Controller, Get, Req, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { FeeEstimateService } from '../fee-estimate.service';
import { FeeEstimateDto } from '../dto/fee-estimate.dto';
import { FeeEstimateGuard } from '../guards/fee-estimate.guard';
import { FeeEstimate } from '../interfaces/fee-estimate.interface';
import { DTO } from '../interfaces/dto.interface';

const bugsnagClient = bugsnag(envConfig.BUGSNAG_KEY);

@Controller('fee-estimate')
@UseGuards(FeeEstimateGuard)
export class FeeEstimateController {
  private readonly feeEstimateService: FeeEstimateService;
  private readonly configService: ConfigService;

  constructor(feeEstimateService: FeeEstimateService, configService: ConfigService) {
    this.feeEstimateService = feeEstimateService;
    this.configService = configService;
  }

  /**
   * Either fetches cached data form the DB or
   * from the external API and puts it in the DB
   * @param  {string}       code
   * @return {Promise<any>}
   */
  async getCoinData(code: string): Promise<any> {
    const result = await this.feeEstimateService.findOne({ code });
    if (result) {
      return result;
    }

    const data = await this.feeEstimateService.fetchExternalApi(code);

    const dto = new FeeEstimateDto({
      code,
      data,
      timestamp: Math.round(+new Date() / 1000),
    });

    await this.feeEstimateService.create(dto);
    return dto;
  }

  /**
   * The API endpoint
   * @param  {Object}       @Req()   request       contains all the request details
   * @param  {Object}       @Param() params        contains all the request parameters
   * @return {Promise<any>}
   */
  @Get(':coin')
  async fetchData(@Req() request, @Param() params): Promise<any> {
    try {
      return await this.getCoinData(params.coin);
    } catch (err) {
      bugsnagClient.notify(err);
      throw new HttpException(`Internal Server Error. ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
