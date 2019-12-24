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

// These should be fine. We can bind a concrete class alone, or a
// concrete class to another concrete class of the same shape. We
// can also bind abstractions to their concrete implementations.
container.register(ConsoleLogger);
container.register(ConsoleLogger, ConsoleLogger);

container.register(Car);
container.register(Car, Car);

container.register(Logger, ConsoleLogger);

// These should throw. You can't bind a concrete class to another
// concrete class of a different shape.
container.register(Car, ConsoleLogger);
container.register(ConsoleLogger, Car);

// These should throw. You can't bind an abstract class to itself.
container.register(Logger);
container.register(Logger, Logger);

// This should also throw because you can't bind an abstraction to
// a concretion of the wrong shape.
container.register(Logger, Car);
container.register(Logger, BadImplementationLogger);
