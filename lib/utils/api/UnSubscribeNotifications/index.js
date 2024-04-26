import {isString, isArray} from '../../index';

const UnSubscribeNotifications = async (params = {}) => {
  try {
    if (!params || !Object.keys(params).length)
      throw new Error('params is not a valid object');

    const {events, request} = params;

    if (!events || !isArray(events))
      throw new Error('events to be subscribed to are null');
    if (!request) throw new Error('Request is not available');

    const parsedEvents = events.filter((event) => !!event && isString(event));
    if (!parsedEvents.length)
      throw new Error('events to be suscribed are invalids');

    const body = {
      events: parsedEvents,
    };

    const response = await request.post({
      service: 'notification',
      namespace: 'unsubscribe',
      pathParams: ['push'],
      body,
    });

    return response;
  } catch (error) {
    return Promise.reject(error?.result || error);
  }
};

export default UnSubscribeNotifications;
