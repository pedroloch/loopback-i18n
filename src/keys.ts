import { BindingKey } from "@loopback/core";
import { I18nApi } from "./provider";

export type I18nOptions = i18n.ConfigurationOptions;

export namespace I18NBindings {
  export const T = BindingKey.create<I18nApi>("provider.i18n.t");
  export const OPTIONS = BindingKey.create<I18nOptions>(
    "provider.i18n.options"
  );
  export const COMPONENT = BindingKey.create<I18nOptions>(
    "components.I18nComponent"
  );
}
