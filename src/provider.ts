import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {Request, RestBindings} from '@loopback/rest';

export type I18nApi = (msg: string | i18n.TranslateOptions, ...placeholders: string[]) => string;

@injectable({scope: BindingScope.TRANSIENT})
export class IntlProvider implements Provider<I18nApi> {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private req: Request,
  ) {}

  value(): I18nApi {
    return (msg, ...placeholders) => this.req.__(msg, ...placeholders);
  }
}
