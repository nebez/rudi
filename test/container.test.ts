import { FirstContainer, injectable } from '../src/index';

abstract class Vehicle {
    abstract drive(): void;
}

class Car extends Vehicle {
    constructor() {
        super();
    }
    drive() {
        // ...
    }
}

@injectable()
class Driver {
    protected vehicle: Vehicle;

    constructor(vehicle: Vehicle) {
        this.vehicle = vehicle;
    }

    drive() {
        this.vehicle.drive();
        return true;
    }
}

class DriverNoAnnotation {
    constructor(vehicle: Vehicle) {
        vehicle.drive();
    }
}

describe('container', () => {
    it('should register and resolve concrete classes', () => {
        const container = new FirstContainer();
        container.register(Car);

        const myCar = container.resolve(Car);
        expect(myCar).toBeInstanceOf(Car);
    });

    it('should register and resolve abstract implementations', () => {
        const container = new FirstContainer();
        container.register(Vehicle, Car);

        const myVehicle = container.resolve(Vehicle);
        expect(myVehicle).toBeInstanceOf(Car);
    });

    it('should throw errors if a class is resolved with an unregistered dependency', () => {
        const container = new FirstContainer();
        container.register(Driver);

        expect(() => {
            container.resolve(Driver);
        }).toThrowError('No registration found for Vehicle');
    });

    it('should register and resolve abstract implementations with concrete constructor args', () => {
        const container = new FirstContainer();
        container.register(Vehicle, Car);
        container.register(Driver);

        const driver = container.resolve(Driver);
        expect(driver.drive()).toBe(true);
    });

    it('should throw errors when trying to register un-annotated classes with constructor args', () => {
        expect(() => {
            const container = new FirstContainer();
            container.register(DriverNoAnnotation);
        }).toThrowError('Attempting to register DriverNoAnnotation with constructor args without an annotation');
    });

    it('should not throw errors when trying to register un-annotated classes without constructor args', () => {
        expect(() => {
            const container = new FirstContainer();
            container.register(Car);
        }).not.toThrow();
    });
});
