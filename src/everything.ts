export function injectable(): ClassDecorator {
    return () => {};
}

type Newable<T> = { new (...args: any[]): T };
type Abstraction<T> = Function & { prototype: T };

interface Scope {
    singletonScope(): void;
    resolutionScope(): void;
}

export interface Container {
    register<To>(to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: To): void;
}
