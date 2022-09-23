import {Component, config, ContextTags, CoreBindings, inject, injectable} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {I18NBindings, I18nOptions} from './keys';
import {i18nMiddleware} from './middleware';
import {IntlProvider} from './provider';

@injectable({tags: {[ContextTags.KEY]: I18NBindings.COMPONENT}})
export class I18nComponent implements Component {
  constructor(
    @config()
    public options: I18nOptions | undefined,
    @inject(CoreBindings.APPLICATION_INSTANCE) app: RestApplication,
  ) {
    app.bind(I18NBindings.T.key).toProvider(IntlProvider);
    app.bind(I18NBindings.OPTIONS).to(options ?? {});
    app.middleware(i18nMiddleware);
  }
}
