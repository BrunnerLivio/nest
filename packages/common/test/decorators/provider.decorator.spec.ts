import { expect } from 'chai';
import { Provider, MiddlewareFunction, Interceptor, mixin, Injectable } from '../../index';

describe('@Injectable', () => {
  @Injectable()
  class TestMiddleware {
    constructor(param: number, test: string) {}
  }

  it('should enhance provider with "design:paramtypes" metadata', () => {
    const constructorParams = Reflect.getMetadata(
      'design:paramtypes',
      TestMiddleware,
    );

    expect(constructorParams[0]).to.be.eql(Number);
    expect(constructorParams[1]).to.be.eql(String);
  });
});

describe('@Interceptor', () => {
  @Interceptor()
  class TestInterceptor {
    constructor(param: number, test: string) {}
  }

  it('should enhance provider with "design:paramtypes" metadata', () => {
    const constructorParams = Reflect.getMetadata(
      'design:paramtypes',
      TestInterceptor,
    );

    expect(constructorParams[0]).to.be.eql(Number);
    expect(constructorParams[1]).to.be.eql(String);
  });
});

describe('mixin', () => {
  @Interceptor()
  class Test {
    constructor(param: number, test: string) {}
  }

  it('should set name of metatype', () => {
    const type = mixin(Test);
    expect(type.name).to.not.eql('Test');
  });

  it('should not lost the design:parmatypes metadata', () => {
    const type = mixin(Test);
    const constructorParams = Reflect.getMetadata('design:paramtypes', type);
    expect(constructorParams[0]).to.be.eql(Number);
    expect(constructorParams[1]).to.be.eql(String);
  });
});
