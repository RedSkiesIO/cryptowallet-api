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

import * as schedule from 'node-schedule';
import { series } from 'async';
import { ConfigService } from '../config/config.service';

export abstract class CacheUpdate {
  protected readonly service: any;
  protected readonly configService: ConfigService;
  protected abstract updateDocument(document: any, callback: any): void;

  /**
   * Sets up a cron job that updates the cache
   */
  protected scheduleInit(cronPattern: string) {
    schedule.scheduleJob(cronPattern, () => {
      this.updateCache();
    });
  }

  /**
   * Fetches documents to update and executes updatedDocument()
   * in series, to prevent flooding the external API with requests
   */
  protected async updateCache() {
    const documents: any = await this.service.findAll();
    const operations = [];

    documents.forEach((document) => {
      operations.push((callback) => this.updateDocument(document, callback));
    });

    return new Promise((resolve) => {
      series(operations, (err) => {
        if (err) {
          // @todo integrate rollbar
        }
        resolve();
      });
    });
  }
}
