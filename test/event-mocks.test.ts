import { createEvent } from '../src';

it('should return a valid event', () => {
  const event = createEvent('sns:Notification', {
    Records: [
      {
        Sns: {
          Message: 'test',
        },
      },
    ],
  });

  expect(event.Records[0].EventSource).toEqual('aws:sns');
  expect(event.Records[0].Sns.Type).toEqual('Notification');

  expect(event.Records[0].Sns.Message).toEqual('test');
});
