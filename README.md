# 4.5

> Functional, curried, and monadic Assertions

The functional assertions library you've been missing!
Your tests should follow the same practices you put into your codebase.
If you prefer functional style APIs and practices in JavaScript or TypeScript
your tests likely don't look too much like your applications. This library aims
to solve this with functionally-oriented assertions that are lazy and monadic.

## Let me have it!
```sh
yarn add 4.5
# or
npm install --save 4.5
```

## API

- All functions of arity 2 or more are curried.
- All types are defined below in the [Types](#types) section.

### Assertions

Create assertions that can be verified. Assertions are **lazy** by default, which
means, they don't *do* anything unless specifically asked to verify themselves.

#### `equals :: a → a → Assertion a`

Creates an assertion that, when verified, will check **value** equality of
items, including deep equality of objects or arrays.

#### `is :: a → a → Assertion a`

Creates an assertion that, when verified, will check **reference** equality of
items.

#### `pass :: a → Assertion a` (Applicative)

Creates an assertion that, when verified, will always succeed with the given
value.

This is `4.5`'s implementation of `Applicative` often called `of` or `just`
in many other libraries.

#### `fail :: * → Assertion *`

Creates an assert that, when verified, will always fail with a string
representation of the given value.

### Combinators

Combinators are what allow you to compose your assertions and express many
aspects of your tests in a declarative and expressive way.

#### `map :: (a → b) → Assertion a → Assertion b` (Functor)

Given a function from one value `a` to another value `b` and an assertion
of `a` returns a new assertion of `b`.

#### `ap :: Assertion (a → b) → Assertion a → Assertion b`

Given an assertion of a function of type `a` to type `b` and an assertion of
type `a` returns an assertion of type `b`

#### `chain :: (a → Assertion b) → Assertion a → Assertion b`

Given a function from one value `a` to `Assertion b` and an assertion of type `a`,
returns an assertion of type `b`

### Interpreters

Interpreters are functions that *verify* assertions.

#### `assert :: Assertion a → unit`

Given an assertion that can be successfully verified as correct, it will return
`void`/`undefined`. Given an assertion that can **not** be verified as correct,
it will throw an Error. This option is perfect for test frameworks that use
thrown errors to signal test status, such as Mocha.

## Types

```typescript
export interface Assertion<T> {
  verify(verification: Verification<T>): void;
}

export interface Verification<T> {
  success(actual: T): any;
  failure(message: string): any;
}
```