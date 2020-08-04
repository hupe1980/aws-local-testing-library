import type {
  SNSEvent,
  CloudFormationCustomResourceCreateEvent,
  CloudFrontRequestEvent,
  CloudFrontResponseEvent,
} from 'aws-lambda';
import type { PartialDeep } from 'type-fest';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';

import cloudformationCreateRequest from './events/cloudformation-create-request.json';
import cloudfrontOriginRequest from './events/cloudfront-origin-request.json';
import cloudfrontOriginResponse from './events/cloudfront-origin-response.json';
import cloudfrontViewerRequest from './events/cloudfront-viewer-request.json';
import cloudfrontViewerResponse from './events/cloudfront-viewer-response.json';
import snsNotification from './events/sns-notification.json';

export const events = {
  'cloudformation:CreateRequest': cloudformationCreateRequest as CloudFormationCustomResourceCreateEvent,
  'cloudfront:OriginRequest': cloudfrontOriginRequest as CloudFrontRequestEvent,
  'cloudfront:OriginResponse': cloudfrontOriginResponse as CloudFrontResponseEvent,
  'cloudfront:ViewerRequest': cloudfrontViewerRequest as CloudFrontRequestEvent,
  'cloudfront:ViewerResponse': cloudfrontViewerResponse as CloudFrontResponseEvent,
  'sns:Notification': snsNotification as SNSEvent,
};

export const createEvent = <T extends keyof typeof events>(
  eventType: T,
  body: PartialDeep<typeof events[T]>
): typeof events[T] => {
  const event = events[eventType];
  return merge(cloneDeep(event), body);
};
