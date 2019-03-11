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
import envConfig from './config/envConfig';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bugsnagClient = bugsnag({
  apiKey: envConfig.BUGSNAG_KEY,
  logger: null,
});


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ exposedHeaders: ['new_refresh_token'] });
  await app.listen(parseInt(envConfig.PORT, 10));
}

bootstrap();

process
  .on('unhandledRejection', (err) => {
    bugsnagClient.notify(err);
  })
  .on('uncaughtException', err => {
    bugsnagClient.notify(err);
  });
