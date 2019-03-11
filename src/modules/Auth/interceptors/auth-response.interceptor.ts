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

import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class AuthResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    return call$.pipe(
      map(async (data) => {
        const req = context.switchToHttp().getRequest();
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        const decoded: any = await this.authService.decodeToken(accessToken);
        const refreshTokenLifespan = parseInt(this.configService.get('REFRESH_TOKEN_LIFESPAN_SEC'), 10);
        const newRefreshToken = await this.authService.createToken(decoded.deviceIdHash, refreshTokenLifespan);

        await this.authService.update({ deviceIdHash: decoded.deviceIdHash }, { refreshTokens: [newRefreshToken] });
        req.res.header('new_refresh_token', newRefreshToken);
        return data;
      }),
    );
  }
}
