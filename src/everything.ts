export function injectable(): ClassDecorator {
    return () => {};
}

type Newable<T> = { new (...args: any[]): T };
type Abstraction<T> = Function & { prototype: T };

export interface Container {
    register<To>(to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): Scope;
}

interface Scope {
    singletonScope(): void;
    resolutionScope(): void;
}
