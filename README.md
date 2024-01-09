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

This library provides the following components and methods:

## Functions

<dl>
<dt><a href="#useNotification">useNotification()</a> ⇒ <code>object</code></dt>
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
<td>is the token linked to the device, which we use to subscribe it to notifications.</td>
</tr>
</tbody></table>
</dd>
<dt><a href="#NotificationProvider">NotificationProvider(children, foregroundCallback, backgroundCallback, config, events, environment)</a> ⇒ <code>null</code> | <code>React.element</code></dt>
<dd><p>It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.</p>
</dd>
</dl>

<a name="useNotification"></a>

## useNotification() ⇒ <code>object</code>
is a hook, which returns the elements contained within the notifications context. Returns an object containing:
| name | description |
 |----------|----------|
 | deviceToken  | is the token linked to the device, which we use to subscribe it to notifications. |

**Kind**: global function  
**Example**  
```js
import {useNotification} from '@janiscommerce/app-push-notification'

const {} = useNotification()
```
<a name="NotificationProvider"></a>

## NotificationProvider(children, foregroundCallback, backgroundCallback, config, events, environment) ⇒ <code>null</code> \| <code>React.element</code>
It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.

**Kind**: global function  
**Throws**:

- null when not receive a children argument


| Param | Type | Description |
| --- | --- | --- |
| children | <code>React.element</code> | Component that will be rendered within the HOC, and about which the notification will be displayed |
| foregroundCallback | <code>function</code> | function that will be executed when a foreground notification is received. |
| backgroundCallback | <code>function</code> | function that will be executed when a background notification is received. |
| config | <code>object</code> | It is an object that contains the user's data, which will be used to subscribe the user to notifications. |
| config.appName | <code>string</code> | name of the aplication |
| config.accessToken | <code>string</code> | accessToken provided by janis |
| config.client | <code>string</code> | client provided by janis |
| events | <code>Array.&lt;string&gt;</code> | is an array that will contain the events to which the user wants to subscribe |
| environment | <code>string</code> | The environment is necessary for the API that we are going to use to subscribe the device to notifications. |

**Example**  
```js
import NotificationProvider from '@janiscommerce/app-push-notification'


//...

const foregroundCallback = (remoteMessage) => console.log('a new FCM:',remoteMessage)
const backgrounCallback = (remoteMessage) => {
 console.log('a new FCM was received in background', remoteMessage)
}

return (
 <NotificationProvider 
   foregroundCallback={foregroundCallback}
   backgroundCallback={backgroundCallback}
   config={client:'fizzmod', accessToken:'access_token_push', appName:'janisAppName'}
   events={['Notification','events','janis']}
   environment='beta'
   >
   <MyComponent/>
 </NotificationProvider>
)
```
