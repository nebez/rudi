# rudi `[wip]`

An opinionated DI container for TypeScript (and JavaScript) with as little magic as possible.

* `yarn install`
* `yarn test:spec`
    * this tests that the specification is correct, **not** the implementation (*which doesn't exist yet*)
    * we test the types exposed in the app `src/*` through `test/spec.ts`
    * the compiler results are then compared against `spec.expected.txt`
* `yarn update-spec`
    * updates the specification based on `test/spec.ts`
* `yarn test`
    * run the functional test suite against the implementation
    * (no implementation exists yet)
* `yarn lint`
    * lint the source and test suite
    * does not lint the spec
* `yarn lint:fix`
    * fixes whatever lint errors it can
* `yarn build`
    * builds the application for all main targets and emits type definitions
        * `commonjs`
        * `es5`
        * `es6`
    * builds can be found in `dist/`
