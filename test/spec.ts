// This file is type-checked against the compiler. You can't execute it
// because we're testing our specification, not the implementation.
import { Container } from '../src/index';

abstract class Logger {
    abstract log(message: string): void;
}

class ConsoleLogger {
    log(message: string) {
        console.log(message);
    }
}

class BadImplementationLogger {
    log(message: number) {
        console.log(message);
    }
}

class Car {
    drive() {
        console.log('driving!');
    }
}

let container: Container;

/**
 * These should be fine.
 */

// We can bind a concrete class alone, or a concrete class to another concrete
// class of the same shape. We can also bind abstractions to their concrete
// implementations.
container.register(ConsoleLogger);
container.register(ConsoleLogger, ConsoleLogger);

container.register(Car);
container.register(Car, Car);

container.register(Logger, ConsoleLogger);

// Self-binding and abstract-to-concrete bindings can have different
// scopes: singleton and request.
container.register(ConsoleLogger).singletonScope();
container.register(ConsoleLogger).resolutionScope();
container.register(ConsoleLogger, ConsoleLogger).singletonScope();
container.register(ConsoleLogger, ConsoleLogger).resolutionScope();

container.register(Car).singletonScope();
container.register(Car).resolutionScope();
container.register(Car, Car).singletonScope();
container.register(Car, Car).resolutionScope();

container.register(Logger, ConsoleLogger).singletonScope();
container.register(Logger, ConsoleLogger).resolutionScope();

// We should also enable instance registration.
const myLogger = { log: (message: string) => { console.error(message); } };
const myLogger2 = new ConsoleLogger();

container.instance(Logger, myLogger);
container.instance(Logger, myLogger2);

container.instance(ConsoleLogger, myLogger);
container.instance(ConsoleLogger, myLogger2);

// Factory registrations would be nice. Factory resolutions can be scoped and
// optionally have full access to the container if desired.
container.factory(Logger, () => new ConsoleLogger());
container.factory(ConsoleLogger, () => new ConsoleLogger());
container.factory(Logger, (c: Container) => new ConsoleLogger());

container.factory(ConsoleLogger, (c: Container) => {
    return { log: (message: string) => { console.error(message); } };
});

container.factory(Logger, () => {
    if (Math.random() > 0.5) {
        return myLogger;
    }

    return myLogger2;
});

container.factory(Logger, () => new ConsoleLogger()).singletonScope();
container.factory(Logger, () => new ConsoleLogger()).resolutionScope();
container.factory(ConsoleLogger, () => new ConsoleLogger()).singletonScope();
container.factory(ConsoleLogger, () => new ConsoleLogger()).resolutionScope();
container.factory(Logger, (c: Container) => new ConsoleLogger()).singletonScope();
container.factory(Logger, (c: Container) => new ConsoleLogger()).resolutionScope();

// Resolving any abstract or concrete types is good
container.resolve(Logger);
container.resolve(ConsoleLogger);
container.resolve(BadImplementationLogger);
container.resolve(Car);

/**
 * These should not be fine.
 */

// You can't bind a concrete class to another concretion of a different shape.
container.register(Car, ConsoleLogger);
container.register(ConsoleLogger, Car);

// You can't bind an abstract class to itself.
container.register(Logger);
container.register(Logger, Logger);

// You can't bind an abstraction to a concretion of the wrong shape.
container.register(Logger, Car);
container.register(Logger, BadImplementationLogger);

// You shouldn't be able to change the scope of an instance binding. These
// should all be errors.
container.instance(Logger, myLogger).singletonScope();
container.instance(Logger, myLogger).resolutionScope();
container.instance(Logger, myLogger2).singletonScope();
container.instance(Logger, myLogger2).resolutionScope();

// You can't attach a wrong shape to an abstraction.
const myBadLogger = { log: (message: string[]) => { console.error(message); } };
container.instance(Logger, myBadLogger);
container.instance(ConsoleLogger, myBadLogger);
container.instance(Car, myBadLogger);

// You can't attach concretions to interfaces. We don't like that kind of magic
interface ILogger extends Logger { }
container.register(ILogger, ConsoleLogger);

// Factory functions must return the right shape - always.
container.factory(Logger, () => new Car());

container.factory(Logger, () => {
    if (Math.random() > 0.5) {
        return myLogger;
    }

    return 'this shouldnt happen';
});


container.factory(ConsoleLogger, () => {
    return { log: (message: string[]) => { console.error(message); } };
});

// Factory functions have access to the container and nothing else.
container.factory(ConsoleLogger, (c: number) => new ConsoleLogger());

// Attempting to resolve anything other than abstract or concrete classes = bad
container.resolve(myBadLogger);
container.resolve<ILogger>(ILogger);
