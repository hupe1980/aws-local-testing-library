import type { Handler } from 'aws-lambda';
import { invokeLambda } from '../src';

test('async return', () => {
  const handler: Handler<unknown, string> = async (): Promise<string> => {
    return 'foo';
  };

  expect.assertions(1);

  return expect(invokeLambda<unknown, string>(handler, {})).resolves.toBe(
    'foo'
  );
});

test('callback return', () => {
  const handler: Handler<unknown, string> = (_event, _context, cb): void => {
    return cb(undefined, 'foo');
  };

  expect.assertions(1);

  return expect(invokeLambda<unknown, string>(handler, {})).resolves.toBe(
    'foo'
  );
});

test('async error', () => {
  const handler: Handler<unknown, never> = async () => {
    throw new Error('Lambda error');
  };

  expect.assertions(1);

  return expect(invokeLambda<unknown, never>(handler, {})).rejects.toThrow(
    'Lambda error'
  );
});

test('callback error', () => {
  const handler: Handler<unknown, never> = (_event, _context, cb) => {
    cb(new Error('Lambda error'));
  };

  expect.assertions(1);

  return expect(invokeLambda<unknown, void>(handler, {})).rejects.toThrow(
    'Lambda error'
  );
});
