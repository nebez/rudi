export function injectable(): ClassDecorator {
    return () => {};
}

export type Newable<T> = { new (...args: any[]): T };
export type Abstraction<T> = Function & { prototype: T };

export interface Container {
    register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): void;
    register<To>(to: Newable<To>): void;
}
