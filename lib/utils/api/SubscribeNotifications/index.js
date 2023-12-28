import axios from 'axios';
import {isString, isArray, validateOauthData, getHeaders} from '../../index';

const SubscribeNotifications = async (params = {}) => {
  try {
    if (!params || !Object.keys(params).length)
      throw new Error('params is not a valid object');

    const {client, accessToken, deviceToken, events, appName, environment} =
      params;

    if (!validateOauthData(accessToken, client))
      throw new Error('accessToken and client are required');
    if (!deviceToken || !isString(deviceToken))
      throw new Error('device token is invalid or null');
    if (!events || !isArray(events))
      throw new Error('events to be subscribed to are null');
    if (!appName || !isString(appName))
      throw new Error('application name are invalid or null');
    if (!environment || !isString(environment))
      throw new Error('environment is invalid or null');

    const parsedEvents = events.filter((event) => !!event && isString(event));
    if (!parsedEvents.length)
      throw new Error('events to be suscribed are invalids');

    const headers = getHeaders({client, accessToken});
    const validUrl = `https://notifications.${environment}.in/api/push/register`;
    const body = {
      deviceToken,
      events: parsedEvents,
      platformApplicationName: appName,
    };

    const {data} = await axios.post(validUrl, body, {headers});

    return data;
  } catch (error) {
    return Promise.reject(error?.response?.data?.message || error);
  }
};

export default SubscribeNotifications;
