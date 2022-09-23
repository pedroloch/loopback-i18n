# I18N for Loopback 4

This module contains a component to add i18n to Loopback 4. It's made on top of the library [i18n](https://www.npmjs.com/package/i18n) for node.

## Instalation

```sh
npm install @pedroloch/loopback-i18n
```

## Binding into the application

The component should be loaded with it's configuration in the constructor of you Application Class. This example assumes you have a folder called locales in your root folder.

```ts


import {BootMixin} from '@loopback/boot';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {readFileSync} from 'fs';
import path from 'path';
import yaml from 'yaml';
import {I18NBindings, I18nComponent, I18nOptions} from '@pedroloch/loopback-i18n';
export {ApplicationConfig};

export class BackendApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //...Your application bindings declarations

    // Should load the configuration first
    this.configure(I18NBindings.COMPONENT).to({
      defaultLocale: 'en',
      locales: ['en', 'pt'],
      directory: path.join(__dirname, '../locales')
    } as I18nOptions); 
    
    // Load the component after the configuration
    this.component(I18nComponent);
    
    }
}
```

## The configuration

For the configuration, you just need to pass the same configuration you would use in the library [i18n](https://www.npmjs.com/package/i18n). Check their specifications for details. You can use the type **I18nOptions** from this library to help you with typescript autocomplete.

```ts
import {I18nOptions} from '@pedroloch/loopback-i18n';
```


## Usage

This example assumes you have these two files, *en.json* and *pt.json*, inside the locales folder that you configured when binding to the application

en.json
```json
{
    "greeting": "Hello",
    "greeting_with_name": "Hello, %s"
}
```
pt.json

```json
{
    "greeting": "Olá",
    "greeting_with_name": "Olá, %s"

}
```

Now you can inject a function that will translate the messages based on the browsers 'Accept-Language'. 

```ts
import { inject } from '@loopback/core';
import { get, param } from '@loopback/rest';
import { I18NBindings, I18nApi } from '@pedroloch/loopback-i18n';

export class MyController {
  constructor(
    @inject(I18NBindings.T)
    public t: I18nApi
  ) {}

  @get('/greeting')
  greeting() {
    return { msg: this.t('greeting') };
  }

  @get('/greeting/{name}')
  greetingWithName(@param.path.string('name') name: string) {
    return { msg: this.t('greeting_with_name', name) };
  }
}
```

Considering you are running the application on port 3000

```sh
curl -X 'GET' \
'http://localhost:3000/gretting' \
-H 'accept: application/json' |
-H 'Accept-Language: en'

# Should return
{msg:'Hello'}
```

```sh
curl -X 'GET' \
'http://localhost:3000/gretting' \
-H 'accept: application/json' \
-H 'Accept-Language: pt'

# Should return
{msg:'Olá'}
```

```sh
curl -X 'GET' \
'http://localhost:3000/gretting/John' \
-H 'accept: application/json' |
-H 'Accept-Language: en'

# Should return
{msg:'Hello, John'}
```

```sh
curl -X 'GET' \
'http://localhost:3000/gretting/John' \
-H 'accept: application/json' \
-H 'Accept-Language: pt'

# Should return
{msg:'Olá, John'}
```

If Accept-Language header is not present, it should return the defaultLocale.

```sh
curl -X 'GET' \
'http://localhost:3000/gretting/John' \
-H 'accept: application/json' |

# Should return
{msg:'Hello, John'}
```