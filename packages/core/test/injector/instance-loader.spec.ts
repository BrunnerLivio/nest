import * as sinon from 'sinon';
import { expect } from 'chai';
import { InstanceLoader } from '../../injector/instance-loader';
import { NestContainer } from '../../injector/container';
import { Injector } from '../../injector/injector';
import { Controller } from '../../../common/decorators/core/controller.decorator';
import { Provider } from '../../../common/decorators/core/provider.decorator';
import { NestEnvironment } from '../../../common/enums/nest-environment.enum';
import { Logger } from '../../../common/services/logger.service';

describe('InstanceLoader', () => {
  let loader: InstanceLoader;
  let container: NestContainer;
  let mockContainer: sinon.SinonMock;

  @Controller('')
  class TestRoute {}

  @Injectable()
  class TestProvider {}

  before(() => Logger.setMode(NestEnvironment.TEST));

  beforeEach(() => {
    container = new NestContainer();
    loader = new InstanceLoader(container);
    mockContainer = sinon.mock(container);
  });

  it('should call "loadPrototypeOfInstance" for each provider and route in each module', async () => {
    const injector = new Injector();
    (loader as any).injector = injector;

    const module = {
      providers: new Map(),
      routes: new Map(),
      injectables: new Map(),
      metatype: { name: 'test' },
    };
    const providerWrapper = { instance: null, metatype: TestProvider };
    const routeWrapper = { instance: null, metatype: TestRoute };

    module.providers.set('TestProvider', providerWrapper);
    module.routes.set('TestRoute', routeWrapper);

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    const loadProviderPrototypeStub = sinon.stub(
      injector,
      'loadPrototypeOfInstance',
    );

    sinon.stub(injector, 'loadInstanceOfRoute');
    sinon.stub(injector, 'loadInstanceOfProvider');

    await loader.createInstancesOfDependencies();
    expect(
      loadProviderPrototypeStub.calledWith(
        providerWrapper,
        module.providers,
      ),
    ).to.be.true;
    expect(
      loadProviderPrototypeStub.calledWith(routeWrapper, module.providers),
    ).to.be.true;
  });

  it('should call "loadInstanceOfProvider" for each provider in each module', async () => {
    const injector = new Injector();
    (loader as any).injector = injector;

    const module = {
      providers: new Map(),
      routes: new Map(),
      injectables: new Map(),
      metatype: { name: 'test' },
    };
    const testComp = {
      instance: null,
      metatype: TestProvider,
      name: 'TestProvider',
    };

    module.providers.set('TestProvider', testComp);

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    const loadProviderStub = sinon.stub(injector, 'loadInstanceOfProvider');
    sinon.stub(injector, 'loadInstanceOfRoute');

    await loader.createInstancesOfDependencies();
    expect(
      loadProviderStub.calledWith(
        module.providers.get('TestProvider'),
        module,
      ),
    ).to.be.true;
  });

  it('should call "loadInstanceOfRoute" for each route in each module', async () => {
    const injector = new Injector();
    (loader as any).injector = injector;

    const module = {
      providers: new Map(),
      routes: new Map(),
      injectables: new Map(),
      metatype: { name: 'test' },
    };
    const wrapper = { name: 'TestRoute', instance: null, metatype: TestRoute };
    module.routes.set('TestRoute', wrapper);

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    sinon.stub(injector, 'loadInstanceOfProvider');
    const loadRoutesStub = sinon.stub(injector, 'loadInstanceOfRoute');

    await loader.createInstancesOfDependencies();
    expect(loadRoutesStub.calledWith(module.routes.get('TestRoute'), module)).to
      .be.true;
  });

  it('should call "loadInstanceOfInjectable" for each injectable in each module', async () => {
    const injector = new Injector();
    (loader as any).injector = injector;

    const module = {
      providers: new Map(),
      routes: new Map(),
      injectables: new Map(),
      metatype: { name: 'test' },
    };
    const testComp = {
      instance: null,
      metatype: TestProvider,
      name: 'TestProvider',
    };
    module.injectables.set('TestProvider', testComp);

    const modules = new Map();
    modules.set('Test', module);
    mockContainer.expects('getModules').returns(modules);

    const loadInjectableStub = sinon.stub(injector, 'loadInstanceOfInjectable');
    sinon.stub(injector, 'loadInstanceOfRoute');

    await loader.createInstancesOfDependencies();
    expect(
      loadInjectableStub.calledWith(
        module.injectables.get('TestProvider'),
        module,
      ),
    ).to.be.true;
  });
});
