import type { Handler } from 'aws-lambda';
import { invokeLambda } from '../src';

test('async return', () => {
  const handler: Handler = async (): Promise<string> => {
    return 'foo';
  };

  expect.assertions(1);

  return expect(invokeLambda<string>(handler)).resolves.toBe('foo');
});

test('callback return', () => {
  const handler: Handler = (_event, _context, cb): void => {
    return cb(undefined, 'foo');
  };

  expect.assertions(1);

  return expect(invokeLambda<string>(handler)).resolves.toBe('foo');
});

test('async error', () => {
  const handler: Handler = async () => {
    throw new Error('Lambda error');
  };

  expect.assertions(1);

  return expect(invokeLambda(handler)).rejects.toThrow('Lambda error');
});

test('callback error', () => {
  const handler: Handler = (_event, _context, cb) => {
    cb(new Error('Lambda error'), undefined);
  };

  expect.assertions(1);

  return expect(invokeLambda(handler)).rejects.toThrow('Lambda error');
});
