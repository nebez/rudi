export function injectable(): ClassDecorator { return () => {} }

type Newable<T> = { new (...args: any[]): T };
type Abstraction<T> = Function & { prototype: T };
type FactoryFunction<T> = (container: Container) => T;

interface Scope {
    singletonScope(): void;
    resolutionScope(): void;
}

interface AbstractRegistration<T, U extends T> {
    type: 'abstract';
    token: Abstraction<T>;
    class: Newable<U>;
}

interface InstanceRegistration<T, U extends T> {
    type: 'instance';
    token: Abstraction<T>;
    instance: U;
}

interface FactoryRegistration<T, U extends T> {
    type: 'factory';
    token: Abstraction<T>;
    factory: FactoryFunction<U>;
}

type ContainerRegistration<T, U extends T> =
    AbstractRegistration<T, U> |
    InstanceRegistration<T, U> |
    FactoryRegistration<T, U>;

export interface Container {
    register<To>(to: Newable<To>): Scope;
    register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): Scope;
    // instance<From, To extends From>(from: Abstraction<From>, to: To): void;
    // factory<From, To extends From>(from: Abstraction<From>, to: FactoryFunction<To>): Scope;
    resolve<T>(token: Abstraction<T>): T;
}

export class FirstContainer implements Container {
    protected registrations = new Map<Abstraction<any>, ContainerRegistration<any, any>>();

    public register<To>(to: Newable<To>): Scope;
    public register<From, To extends From>(from: Abstraction<From>, to: Newable<To>): Scope;
    public register<From, To extends From>(...args: [Newable<To>] | [Abstraction<From>, Newable<To>]): Scope {
        let registration;

        if (args.length === 1) {
            registration = { token: args[0], class: args[0] };
        } else {
            registration = { token: args[0], class: args[1] };
        }

        if (registration.class.length >= 1 && this.getParams(registration.class) == undefined) {
            throw new Error(`Attempting to register ${registration.class.name} that has constructor args without an annotation`);
        }

        this.registrations.set(args[0], {
            type: 'abstract',
            ...registration,
        });

        return { singletonScope: () => {}, resolutionScope: () => {} }
    }

    public resolve<T>(token: Abstraction<T>): T {
        const registration = this.registrations.get(token);

        if (registration == undefined) {
            // todo - can we just construct it if it's newable and has no args?
            // return new (token as any)();
            throw new Error(`No registration found for ${token.name}. Did you forget to add it to the container?`);
        }

        if (registration.type === 'factory' || registration.type === 'instance') {
            throw new Error(`Not implemented yet`);
        }

        const args = this.createConstructorArguments(registration.class);

        return new registration.class(...args);
    }

    protected createConstructorArguments<T>(forClass: Newable<T>): any[] {
        const params = this.getParams(forClass);

        if (params == undefined) {
            // throw new Error('Missing something for ' + forClass.name);
            return [];
        }

        return params.map((x: Abstraction<T>) => this.resolve(x));
    }

    protected getParams<T>(forClass: Newable<T>): any[] | undefined {
        return Reflect.getMetadata('design:paramtypes', forClass);
    }
}
