// This file is type-checked against the compiler. You can't execute it
// because we're testing our specification, not the implementation.
import { Container } from '../src/everything';

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

container.register(Logger, myLogger);
container.register(Logger, myLogger2);

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
container.register(Logger, myLogger).singletonScope();
container.register(Logger, myLogger).resolutionScope();
container.register(Logger, myLogger2).singletonScope();
container.register(Logger, myLogger2).resolutionScope();

// You can't attach a wrong shape to an abstraction.
const myBadLogger = { log: (message: string[]) => { console.error(message); } };
container.register(Logger, myBadLogger);
