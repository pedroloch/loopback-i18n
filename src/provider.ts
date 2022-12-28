import { BindingScope, inject, injectable, Provider } from '@loopback/core';
import { Request, RestBindings } from '@loopback/rest';

export type I18nApi = {
  (msg: string | i18n.TranslateOptions, ...replace: string[]): string;
  (
    msg: string | i18n.TranslateOptions,
    replacements: i18n.Replacements
  ): string;
};

@injectable({ scope: BindingScope.TRANSIENT })
export class IntlProvider implements Provider<I18nApi> {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private req: Request
  ) {}

  value(): I18nApi {
    if (!this.req) {
      return ((msg: string | i18n.TranslateOptions, ...replace: string[]) =>
        msg) as I18nApi;
    }

    return this.req.__;
  }
}
