import { inject } from '@loopback/core';
import { get, param } from '@loopback/rest';
import { I18nBindings, I18nApi } from '../../';

export class TestController {
  constructor(
    @inject(I18nBindings.T)
    public t: I18nApi
  ) {}

  @get('/greeting')
  greeting() {
    return { msg: this.t('greeting') };
  }

  @get('/greeting/{name}')
  greetingWithName(@param.path.string('name') name: string) {
    return {
      msg: this.t('greeting_with_name', {
        name,
      }),
    };
  }
}
