// Copyright (C) Atlas City Global <https://atlascity.io>
// This file is part of cryptowallet-api <https://github.com/cryptowallet-api>.
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

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';

interface Params {
  coin: string;
  currency: string;
}

@Injectable()
export class PriceFeedGuard implements CanActivate {
  validateParams(params: Params): boolean {
    const validCoins: boolean = params.coin.split(',').every((coin) => {
      return new RegExp('^[A-Z]{0,10}$').test(coin);
    });

    const validCurrencies: boolean = params.currency.split(',').every((currency) => {
      return new RegExp('^[A-Z]{0,3}$').test(currency);
    });

    return validCoins && validCurrencies;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.validateParams(request.params)) {
      return true
    } else {
      throw new HttpException('Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
