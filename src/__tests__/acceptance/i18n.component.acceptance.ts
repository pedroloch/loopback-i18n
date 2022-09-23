import { Application } from '@loopback/core';
import { RestApplication, RestServer } from '@loopback/rest';
import { I18nComponent } from '../../component';
import {
  createRestAppClient,
  expect,
  Client,
  givenHttpServerConfig,
} from '@loopback/testlab';
import { I18NBindings, I18nOptions } from '../../keys';
import { TestController } from '../fixtures/controller';

describe('i18n component', () => {
  let app: RestApplication;
  let client: Client;

  before(async () => {
    const restConfig = givenHttpServerConfig({});

    app = new RestApplication({
      rest: restConfig,
    });

    app.configure(I18NBindings.COMPONENT).to({
      defaultLocale: 'en',
      locales: ['en', 'pt'],
      staticCatalog: {
        en: {
          greeting: 'Hello from Loopback',
          greeting_with_name: 'Hello from Loopback, {{name}}',
        },
        pt: {
          greeting: 'Olá do Loopback',
          greeting_with_name: 'Olá do Loopback, {{name}}',
        },
      },
    } as I18nOptions);

    app.component(I18nComponent);
    app.controller(TestController);

    await app.start();
    client = createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  it('should return the english message as default', async () => {
    const { body } = await client.get('/greeting').expect(200);
    expect(body.msg).to.equal('Hello from Loopback');
  });

  it('should return the portuguese message', async () => {
    const { body } = await client
      .get('/greeting')
      .set('Accept-Language', 'pt')
      .expect(200);

    expect(body.msg).to.equal('Olá do Loopback');
  });

  it('should return the english message with name', async () => {
    const { body } = await client.get('/greeting/John').expect(200);
    expect(body.msg).to.equal('Hello from Loopback, John');
  });

  it('should return the portuguese message with name', async () => {
    const { body } = await client
      .get('/greeting/John')
      .set('Accept-Language', 'pt')
      .expect(200);

    expect(body.msg).to.equal('Olá do Loopback, John');
  });

  it('should return the english message with name when the language is not supported', async () => {
    const { body } = await client
      .get('/greeting/John')
      .set('Accept-Language', 'es')
      .expect(200);

    expect(body.msg).to.equal('Hello from Loopback, John');
  });
});
