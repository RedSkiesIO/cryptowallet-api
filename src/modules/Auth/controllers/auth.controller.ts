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

import { Controller, Get, Post, Req, Param, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Device } from '../interfaces/device.interface';
import { DeviceDto } from '../dto/device.dto';
import { ConfigService } from '../../../config/config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates both access and refresh tokens, inserts deviceIdHash and refresh token into DB
   * if the device already exists in the DB, updates the refresh token
   * @param  {Object}       @Req()   request
   * @param  {Object}       @Param() params
   * @return {Promise<Object>}
   */
  @Get('token/:deviceIdHash')
  async createToken(@Req() request, @Param() params): Promise<any> {
    const { deviceIdHash } = params;
    const device = await this.authService.findOne({ deviceIdHash });

    const accessTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);
    const refreshTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);

    const accessToken = await this.authService.createToken(deviceIdHash, accessTokenLifespan);
    const refreshToken = await this.authService.createToken(deviceIdHash, refreshTokenLifespan);

    if (!device) {
      const dto = new DeviceDto({
        deviceIdHash,
        refreshTokens: [refreshToken],
      });

      await this.authService.create(dto);
    } else {
      await this.authService.update({ deviceIdHash }, { refreshTokens: [refreshToken] });
    }

    return { accessToken, refreshToken };
  }

  /**
   * Grants a new access token if provided with a valid deviceIdHash and a valid refresh token
   * @param  {Object}       @Body() body
   * @return {Promise<Objet>}
   */
  @Post('refresh')
  async refreshToken(@Body() body): Promise<any> {
    const decoded: any = await this.authService.decodeToken(body.refresh_token);
    const deviceIdHash = decoded.deviceIdHash;

    const device = await this.authService.findOne({ deviceIdHash });
    if (!device) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (device.refreshTokens.includes(body.refresh_token)) {
      const accessTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);
      const refreshTokenLifespan = parseInt(this.configService.get('ACCESS_TOKEN_LIFESPAN_SEC'), 10);

      const accessToken = await this.authService.createToken(deviceIdHash, accessTokenLifespan);
      const refreshToken = await this.authService.createToken(deviceIdHash, refreshTokenLifespan);
      await this.authService.update({ deviceIdHash }, { refreshTokens: [refreshToken] });
      return { accessToken, refreshToken };
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
