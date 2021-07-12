'use strict';

import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  id: string;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
  }
}
