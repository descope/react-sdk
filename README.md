# @descope/react-sdk
This library lets you consume your login pages created by Descope console-app in your application
Under the hood, it uses [web-js-sdk](https://github.com/descope/web-js-sdk)

## Usage
### Install the package
```bash
npm install @descope/react-sdk
```

### Render it in your application
#### Wrap your app with Auth Provider
```js
import { AuthProvider } from '@descope/react-sdk'

const AppRoot = () => {
    return (
        <AuthProvider 
            projectId="myProjectId" 
        >
         <App />
        </AuthProvider>
    )
}
```
#### Use Descope to render specific flow
You can use **default flows** or **provide flow id** directly to the Descope component

##### 1. Default flows

```js
import { SignInFlow } from '@descope/react-sdk'
// you can choose flow to run from the following
// import { SignUpFlow } from '@descope/react-sdk'
// import { SignUpOrInFlow } from '@descope/react-sdk'

const App = () => {
    return (
        {...}
        <SignInFlow 
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in!')}
        />
    )
}
```

##### 2. Provide flow id

```js
import { Descope } from '@descope/react-sdk'

const App = () => {
    return (
        {...}
        <Descope 
            flowId="myFlowId" 
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in!')}
        />
    )
}
```

#### use `useAuth` hook in your components to implement specific logic according to authentication state
```js
import { useAuth } from '@descope/react-sdk'

const App = () => {
    // NOTE - `useAuth` should be used inside `AuthProvider` context, 
    // and will throw an exception if this requirement is not met
    const { authenticated, user, logout } = useAuth()
    return (
        {...}
        {
            // render different components if current session is authenticated 
            authenticated && <MyPrivateComponent />
        }
        {
            // render user's content 
            authenticated && <div>Hello ${user.name}</div>
        }
        {
            // logout button
            authenticated && <button onClick={logout}>Logout</div>
        }
    )
}
```

#### Session token server validation (pass session token to server API) 
When developing a full-stack application, it is common to have private server API which requires a valid session token:

![session-token-validation-diagram](https://docs.descope.com/static/SessionValidation-cf7b2d5d26594f96421d894273a713d8.png)


Note: Descope also provides server-side SDKs in various languages (NodeJS, Go, Python, etc). Descope's server SDKs have out-of-the-box session validation API that supports the options described bellow.

The mechanism to pass session token depends on the Descope project's "Token response method" configuration.
##### 1. Manage in cookies
 - Descope sets session token as cookie, which automatically sent each server api request. This option is more secure and is the recommended method for managing tokens, but for this option to work well with the browser - you must also configure a CNAME record for the custom domain listed, which will give a unified log in experience and securely restrict access to the session tokens that are stored in the cookies.

 When this option is configured, the browser will automatically add the session token cookie to the server in every request.

##### 2. Manage in response body
 - Descope API returns session token in body. In this option, The React application should pass session cookie (`const { sessionToken } = useAuth()`) as Authorization header. This option never requires a custom domain, and is recommended for testing or while working in a sandbox environment.

An example for using session token,

```js
import { useAuth } from '@descope/react-sdk'
import { useCallback } from 'react'

const App = () => {
    const { sessionToken } = useAuth()
  
    const onClick = useCallback(() => {     
        fetch('https://localhost:3002/api/some-path' {
            method: 'POST',
            headers: { Authorization: `Bearer ${sessionToken}` }
        })
    },[sessionToken])
    return (
        {...}
        {
            // button that triggers an API that may use session token
            <button onClick={onClick}>Click Me</div>
        }
    )
}
```

## Contributing to this project
In order to use this repo locally
 - Clone this repository
 - Navigate to repository directory
 - Run `npm i`
 - Edit `src/app/index.tsx` in the following way
      - Set `projectId` prop - replace `<project-id>` with your project id
      - Set `flowId` prop - Replace  `<flow-id>` (for example - `sign-up-or-in`)
      - Optional - set a different `baseUrl` (for example - `http://localhost:8000`)    
 - Run `npm run start`
 - Go to `http://localhost:3000/` and start flow