import {isString, isArray, isObject} from '../../index';

const SubscribeNotifications = async (params = {}) => {
  try {
    if (!params || !Object.keys(params).length)
      throw new Error('params is not a valid object');

    const {deviceToken, events, appName, request, additionalInfo} = params;

    if (!deviceToken || !isString(deviceToken))
      throw new Error('device token is invalid or null');
    if (!events || !isArray(events))
      throw new Error('events to be subscribed to are null');
    if (!appName || !isString(appName))
      throw new Error('application name are invalid or null');
    if (!request) throw new Error('Request is not available');

    const parsedEvents = events.filter((event) => !!event && isString(event));
    if (!parsedEvents.length)
      throw new Error('events to be suscribed are invalids');

    const validAdditionalInfo =
      isObject(additionalInfo) && !!Object.keys(additionalInfo).length;

    const body = {
      token: deviceToken,
      events: parsedEvents,
      platformApplicationName: appName,
      ...(validAdditionalInfo && {
        additionalInfo,
      }),
    };

    const response = await request.post({
      service: 'notification',
      namespace: 'subscribe',
      pathParams: ['push'],
      body,
    });

    return response;
  } catch (error) {
    return Promise.reject(error?.result || error);
  }
};

export default SubscribeNotifications;
