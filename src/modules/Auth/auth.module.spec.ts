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

import * as request from 'supertest';
import envConfig from '../../config/envConfig';
import MongoMemoryServer from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { FeeEstimateController } from '../FeeEstimate/controllers/fee-estimate.controller';
import { FeeEstimateService } from '../FeeEstimate/fee-estimate.service';
import { FeeEstimateModule } from '../FeeEstimate/fee-estimate.module';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../../config/config.module';

describe('AuthModule', () => {
  let app: INestApplication;
  let mongoServer;
  let token;
  let refreshToken;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();

    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        FeeEstimateModule,
        ConfigModule,
        MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
      ],
      controllers: [AuthController, FeeEstimateController],
      providers: [AuthService, FeeEstimateService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).get('/auth/token/:fake');
    token = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  describe('auth.module.ts', () => {
    describe('/auth/token/:deviceIdHash', () => {
      it('generates access token and refresh token when called', async (done) => {
        expect(typeof token).toBe('string');
        expect(typeof refreshToken).toBe('string');

        done();
      });

      it('denies access if called with malformed token', async (done) => {
        return request(app.getHttpServer())
          .get('/fee-estimate/BTC')
          .set('Authorization', `Bearer InVaLiDtOkEn`)
          .expect(401)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body.message).toBe('Unauthorized. jwt malformed');
            done();
          });
      });

      it('denies access if called with invalid token', async (done) => {
        // tslint:disable-next-line:max-line-length
        const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZW1haWwuY29tIiwiaWF0IjoxNTUxODkxNTA1LCJleHAiOjE1NTE4OTUxMDV9.aQ13kk6QSQagPGV9yhE-UntBrSok_XR2bmptZSjxuUd';
        return request(app.getHttpServer())
          .get('/fee-estimate/BTC')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body.message).toBe('Unauthorized. invalid signature');
            done();
          });
      });

      it('allows access if called with a valid token', async (done) => {
        return request(app.getHttpServer())
          .get('/fee-estimate/BTC')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('denies access if called with expired token', async (done) => {
        // tslint:disable-next-line:max-line-length
        const expiredAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiJmYWtlIiwiaWF0IjoxNTUyMDYxMTgyLCJleHAiOjE1NTIwNjExODN9.Ow-C8lZC6VuCvoqcA2Y28h0lWNC7Nm14TmeiU775E6c';
        return request(app.getHttpServer())
          .get('/fee-estimate/BTC')
          .set('Authorization', `Bearer ${expiredAccessToken}`)
          .expect(401)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.body.message).toBe('Unauthorized. jwt expired');
            done();
          });
      });
    });

    describe('/auth/refresh', () => {
      it('responds with new set of tokens if called with valid refresh token', async (done) => {
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refresh_token: refreshToken })
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(typeof response.body.accessToken).toBe('string');
            expect(typeof response.body.refreshToken).toBe('string');
            done();
          });
      });

      it('denies access if called with incorrect refresh token', async (done) => {
        // tslint:disable-next-line:max-line-length
        const incorrectRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiJmYWtlIiwiaWF0IjoxNTUyMzAwMzU3LCJleHAiOjE1NTQ5Nzg3NTd9.-raWl26uOdXVvv9k8Rfxopaf2rpcAwDHktOezGz70Bw';
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refresh_token: incorrectRefreshToken })
          .expect(401)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('denies access if called with expired refresh token', async (done) => {
        // tslint:disable-next-line:max-line-length
        const expiredRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiJmYWtlIiwiaWF0IjoxNTUyMzAwMzU3LCJleHAiOjE1NTQ5Nzg3NTd9.-raWl26uOdXVvv9k8RfxopafprpcAwDHktOezGz70Bw';
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .send({ refresh_token: expiredRefreshToken })
          .expect(401)
          .expect('Content-Type', /json/)
          .then((response) => {
            done();
          });
      });

      it('returns a new refresh token with a valid request made', async (done) => {
        let response = await request(app.getHttpServer())
          .get('/fee-estimate/BTC')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /json/);

        expect(typeof response.header.new_refresh_token).toBe('string');
        expect(refreshToken !== response.header.new_refresh_token).toBe(true);

        setTimeout(async () => {
          response = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: response.header.new_refresh_token })
            .expect(201)
            .expect('Content-Type', /json/);

          expect(typeof response.body.accessToken).toBe('string');
          expect(typeof response.body.refreshToken).toBe('string');
          done();
        }, 1000);
      });
    });
  });

  afterAll(async () => {
    mongoServer.stop();
    await app.close();
  });
});
