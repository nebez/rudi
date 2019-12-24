export function injectable(): ClassDecorator {
    return () => {};
}

type Newable<T> = { new (...args: any[]): T };
type Abstraction<T> = Function & { prototype: T };

interface Scope {
    singletonScope(): void;
    resolutionScope(): void;
}

type FactoryFunction<T> = (container: Container) => T;

export interface Container {
    register<To>(to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: To): void;
    register<From, To extends From>(from: Abstraction<From>, to: FactoryFunction<To>): Scope;
}
