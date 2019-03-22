import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AbstractService } from '../../abstract/AbstractService';
import { ConfigService } from '../../config/config.service';
import { Device } from './interfaces/device.interface';
import { DeviceDto } from './dto/device.dto';
export declare class AuthService extends AbstractService<Device, DeviceDto> {
    protected readonly model: Model<Device>;
    private readonly configService;
    private readonly jwtService;
    constructor(model: Model<Device>, configService: ConfigService, jwtService: JwtService);
    createToken(deviceIdHash: string, expiresIn: number): Promise<string>;
    decodeToken(token: any): Promise<string | {
        [key: string]: any;
    }>;
}
