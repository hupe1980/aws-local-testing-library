import { Handler, Context, Callback } from 'aws-lambda';
import * as uuid from 'uuid';
import isPromise from 'is-promise';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const invokeLambda = <TEvent = any, TResult = any>(
  handler: Handler<TEvent, TResult>,
  event: TEvent
): Promise<TResult> => {
  return new Promise((resolve, reject) => {
    try {
      const callback: Callback<TResult> = (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      };

      const context = createContext({
        fail: (err) => callback(err),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        succeed: (result: any): void => callback(undefined, result as TResult),
        done: (err, result) => callback(err, result),
      });

      // setup process.env
      const result = handler(event, context, callback);

      if (isPromise(result)) {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const createContext = (props: Partial<Context> = {}): Context => {
  const { functionName = 'testLambda', functionVersion = '$LATEST' } = props;

  return {
    callbackWaitsForEmptyEventLoop: true,
    done: () => {
      return;
    },
    fail: () => {
      return;
    },
    succeed: () => {
      return;
    },
    getRemainingTimeInMillis: () => 60,
    awsRequestId: createId(),
    functionName,
    functionVersion,
    invokedFunctionArn: createFunctionArn(functionName),
    memoryLimitInMB: '128',
    logGroupName: `/aws/lambda/${functionName}`,
    logStreamName: createLogStreamName(functionVersion),
    ...props,
  };
};

const createId = (): string => uuid.v4();

const createFunctionArn = (functionName: string): string => {
  const region = process.env.AWS_REGION ?? 'us-east-1';
  return `arn:aws:lambda:${region}:999999999999:function:${functionName}`;
};

const createLogStreamName = (
  functionVersion: string,
  date = new Date()
): string => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const id = createId().replace(/-/gi, '');

  return `${year}/${month}/${day}/[${functionVersion}]${id}`;
};
