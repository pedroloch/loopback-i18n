import { Middleware } from '@loopback/rest';
import { I18n } from 'i18n';
import { I18nBindings } from './keys';

export const i18nMiddleware: Middleware = async (ctx, next) => {
  const options = await ctx.get(I18nBindings.OPTIONS);
  const i18n = new I18n(options);

  const { request, response } = ctx;
  i18n.init(request, response);

  return next();
};
