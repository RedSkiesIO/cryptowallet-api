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

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AbstractService } from '../../abstract/AbstractService';
import { ConfigService } from '../../config/config.service';
import { Device } from './interfaces/device.interface';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class AuthService extends AbstractService<Device, DeviceDto> {
  constructor(
    @InjectModel('Device') protected readonly model: Model<Device>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async createToken(deviceIdHash: string, expiresIn: number) {
    const device: JwtPayload = { deviceIdHash };
    return this.jwtService.sign(device, { expiresIn });
  }

  async decodeToken(token: any) {
    return this.jwtService.decode(token);
  }
}
