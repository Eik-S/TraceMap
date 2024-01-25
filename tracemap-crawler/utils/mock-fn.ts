/**
 * Helpful cast which allows you to do typesafe mocking functions like this
 *
 * @example
 * import { someFn } from './some/module'
 * jest.mock('./some/module')
 * mockFn(someFn).mockReturnValueOnce(1)
 */
export function mockFn<ReturnValue, Arguments extends unknown[]>(
  aFunction: (...args: Arguments) => ReturnValue,
): jest.Mock<ReturnValue, Arguments> {
  return aFunction as jest.Mock<ReturnValue, Arguments>
}
