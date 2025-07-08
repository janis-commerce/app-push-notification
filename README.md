# @janiscommerce/app-push-notification

![janis-logo](brand-logo.png)

Library for receiving notifications issued from firebase/janis.


## PeerDependencies installation:

In order to receive notifications it is necessary to include the dependency


```javascript
    npm install @react-native-firebase/messaging
```

## Installation:


```javascript
    npm install @janis-commerce/app-push-notification
```


## What is received from firebase?

What is received is an object called RemoteMessage, which contains the data emitted from Firebase and is what triggers the notification listeners.
Inside remoteMessage you get the notifications object that contains the information that we could use to render a component with the application in the foreground

For more information about this, read https://rnfirebase.io/reference/messaging/remotemessage

## Customize background notification sound:

To customize the background notification sound, you can pass the `backgroundNotificationSound` parameter to the `NotificationProvider` component. By default, it uses the 'default' sound.

```javascript
import NotificationProvider from '@janiscommerce/app-push-notification'

return (
 <NotificationProvider
   appName='pickingApp'
   events={["picking:session:created","picking:session:assigned"]}
   environment='beta'
   backgroundNotificationSound='custom_sound' // Custom sound file name
   >
   <MyComponent/>
 </NotificationProvider>
)
```

To use a custom sound on Android, you must:
1. Place the sound file in the `android/app/src/main/res/raw/` folder
2. The file name must be lowercase and without special characters
3. The sound file must be in .mp3, .wav, or .aac format
4. Pass the exactly file name (without extension) as the value of `backgroundNotificationSound`

# This library provides the following components and methods:

## Functions

<dl>
<dt><a href="#NotificationProvider">NotificationProvider(children, appName, events, environment, additionalInfo, channelConfigs)</a> ⇒ <code>null</code> | <code>React.element</code></dt>
<dd><p>It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.</p>
</dd>
<dt><a href="#setupBackgroundMessageHandler">setupBackgroundMessageHandler(callback)</a></dt>
<dd><p>This function is responsible for handling any callbacks from Firebase cloud messaging in the background or with the application closed</p>
</dd>
<dt><a href="#usePushNotification">usePushNotification()</a> ⇒ <code>object</code></dt>
<dd><p>is a hook, which returns the elements contained within the notifications context. Returns an object containing:</p>
<table>
<thead>
<tr>
<th>name</th>
<th>description</th>
</tr>
</thead>
<tbody><tr>
<td>deviceToken</td>
<td>Is the token linked to the device, which we use to subscribe it to notifications.</td>
</tr>
<tr>
<td>foregroundNotification</td>
<td>An object containing all data received when a foreground push notification is triggered.</td>
</tr>
<tr>
<td>backgroundNotification</td>
<td>An object containing all data received when a background push notification is triggered.</td>
</tr>
<tr>
<td>subscribeError</td>
<td>An object containing all data received from a notification service subscription failure.</td>
</tr>
<tr>
<td>cancelNotifications</td>
<td>This util is responsible for making the request to unsubscribe from all notification events. If no arguments are received, the request will be made with the previously registered events. <em>⚠️ Deprecated: Use cancelNotificationsSubscription instead.</em></td>
</tr>
<tr>
<td>updateSuscription</td>
<td>This function is responsible for updating the subscription to the notification service</td>
</tr>
<tr>
<td>addNewEvent</td>
<td>This function allows you to add a new event to receive notifications.</td>
</tr>
<tr>
<td>deleteReceivedNotification</td>
<td>An util that clears the foreground or background notification state to the depending on the type it receives by parameter</td>
</tr>
<tr>
<td>getSubscribedEvents</td>
<td>This function returns an array with the events to which the user is subscribed.</td>
</tr>
</tbody></table>
</dd>
</dl>

<a name="NotificationProvider"></a>

## NotificationProvider(children, appName, events, environment, additionalInfo, channelConfigs) ⇒ <code>null</code> \| <code>React.element</code>
It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.

**Kind**: global function  
**Throws**:

- null when not receive a children argument


| Param | Type | Description |
| --- | --- | --- |
| children | <code>React.element</code> | Component that will be rendered within the HOC, and about which the notification will be displayed |
| appName | <code>string</code> | name of the aplication |
| events | <code>Array.&lt;string&gt;</code> | is an array that will contain the events to which the user wants to subscribe |
| environment | <code>string</code> | The environment is necessary for the API that we are going to use to subscribe the device to notifications. |
| additionalInfo | <code>object</code> | fields to be sent as part of the body of the subscription request |
| channelConfigs | <code>Array.&lt;(string\|object)&gt;</code> | is the configuration that will be used to create new notification channels |

**Example**  
```js
import NotificationProvider from '@janiscommerce/app-push-notification'

return (
 <NotificationProvider
   appName='pickingApp'
   events={["picking:session:created","picking:session:assigned"]}
   environment='beta'
   >
   <MyComponent/>
 </NotificationProvider>
)
```
<a name="setupBackgroundMessageHandler"></a>

## setupBackgroundMessageHandler(callback)
This function is responsible for handling any callbacks from Firebase cloud messaging in the background or with the application closed

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | is the function that will receive the payload and render it as appropriate |

<a name="usePushNotification"></a>

## usePushNotification() ⇒ <code>object</code>
is a hook, which returns the elements contained within the notifications context. Returns an object containing:
| name | description |
 |----------|----------|
 | deviceToken | Is the token linked to the device, which we use to subscribe it to notifications. |
 | foregroundNotification | An object containing all data received when a foreground push notification is triggered. |
 | backgroundNotification | An object containing all data received when a background push notification is triggered. |
 | subscribeError | An object containing all data received from a notification service subscription failure. |
 | cancelNotifications | This util is responsible for making the request to unsubscribe from all notification events. If no arguments are received, the request will be made with the previously registered events. |
 | updateSuscription | This function is responsible for updating the subscription to the notification service |
 | addNewEvent | This function allows you to add a new event to receive notifications. |
 | deleteReceivedNotification | An util that clears the foreground or background notification state to the depending on the type it receives by parameter
 | getSubscribedEvents | This function returns an array with the events to which the user is subscribed. |

**Kind**: global function  
**Example**  
```js
import {usePushNotification} from '@janiscommerce/app-push-notification'

const { deviceToken, foregroundNotification, backgroundNotification} = usePushNotification()
```
