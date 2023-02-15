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
import { AuthProvider } from '@descope/react-sdk';

const AppRoot = () => {
	return (
		<AuthProvider projectId="my-project-id">
			<App />
		</AuthProvider>
	);
};
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
            flowId="my-flow-id"
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in')}
            // theme can be "light" or "dark". If empty, Descope will use the OS theme
            // theme="light"

            // debug can be set to true to enable debug mode
            // debug={true}

            // You can configure which tenant the signin/signup flow will sign the user into by providing the tenant ID
            // tenant=<tenantId>

            // You can configure the redirect URL for OAuth and SSO (will be used when redirecting back from the OAuth provider / IdP), or for "Magic Link" and "Enchanted Link" (will be used as a link in the message sent to the the user)
            // redirectUrl=<redirectUrl>
        />
    )
}
```

#### Use the `useDescope`, `useSession` and `useUser` hooks in your components in order to get authentication state, user details and utilities

This can be helpful to implement application-specific logic. Examples:

- Render different components if current session is authenticated
- Render user's content
- Logout button

```js
import { useDescope, useSession, useUser } from '@descope/react-sdk'

const App = () => {
    // NOTE - `useDescope`, `useSession`, `useUser` should be used inside `AuthProvider` context,
    // and will throw an exception if this requirement is not met
    const { isAuthenticated, isSessionLoading } = useSession()
    const { user, isUserLoading } = useUser()
    const { logout } = useDescope()

    if(isSessionLoading || isUserLoading){
        return <p>Loading...</p>
    }

     if(isAuthenticated){
        return (
            <p>Hello ${user.name}</p>
            <button onClick={logout}>Logout</div>
        )
    }

    return <p>You are not logged in</p>
}
```

#### Session token server validation (pass session token to server API)

When developing a full-stack application, it is common to have private server API which requires a valid session token:

![session-token-validation-diagram](https://docs.descope.com/static/SessionValidation-cf7b2d5d26594f96421d894273a713d8.png)

Note: Descope also provides server-side SDKs in various languages (NodeJS, Go, Python, etc). Descope's server SDKs have out-of-the-box session validation API that supports the options described bellow. To read more about session validation, Read [this section](https://docs.descope.com/build/guides/gettingstarted/#session-validation) in Descope documentation.

There are 2 ways to achieve that:

1. Using `getSessionToken` to get the token, and pass it on the `Authorization` Header (Recommended)
2. Passing `sessionTokenViaCookie` boolean prop to the `AuthProvider` component (Use cautiously, session token may grow, especially in cases of using authorization, or adding custom claim)

##### 1. Using `getSessionToken` to get the token

An example for api function, and passing the token on the `Authorization` header:

```js
import { getSessionToken } from '@descope/react-sdk';

// fetch data using back
// Note: Descope backend SDKs support extracting session token from the Authorization header
export const fetchData = async () => {
	const sessionToken = getSessionToken();
	const res = await fetch('/path/to/server/api', {
		headers: {
			Authorization: `Bearer ${sessionToken}`
		}
	});
	// ... use res
};
```

An example for component that uses `fetchData` function from above

```js
// Component code
import { fetchData } from 'path/to/api/file'
import { useCallback } from 'react'

const Component = () => {
    const onClick = useCallback(() => {
        fetchData()
    },[])
    return (
        {...}
        {
            // button that triggers an API that may use session token
            <button onClick={onClick}>Click Me</div>
        }
    )
}
```

##### 2. Passing `sessionTokenViaCookie` boolean prop to the `AuthProvider`

Passing `sessionTokenViaCookie` prop to `AuthProvider` component. Descope SDK will automatically store session token on the `DS` cookie.

Note: Use this option if session token will stay small (less than 1k). Session token can grow, especially in cases of using authorization, or adding custom claims

Example:

```js
import { AuthProvider } from '@descope/react-sdk';

const AppRoot = () => {
	return (
		<AuthProvider projectId="my-project-id" sessionTokenViaCookie>
			<App />
		</AuthProvider>
	);
};
```

Now, whenever you call `fetch`, the cookie will automatically be sent with the request. Descope backend SDKs also support extracting the token from the `DS` cookie.

## Code Example

You can find an example react app in the [examples folder](https://github.com/descope/react-sdk/blob/main/examples).

### Setup

To run the examples, set your `Project ID` by setting the `DESCOPE_PROJECT_ID` env var or directly
in the sample code.
Find your Project ID in the [Descope console](https://app.descope.com/settings/project).

```bash
export DESCOPE_PROJECT_ID=<Project-ID>
```

Alternatively, put the environment variable in `.env` file in the project root directory.
See bellow for an `.env` file template with more information.

### Run Example

Run the following command in the root of the project to build and run the example:

```bash
npm i && npm start
```

### Example Optional Env Variables

See the following table for customization environment variables for the example app:

| Env Variable            | Description                                                                                                             | Default value     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------- |
| DESCOPE_FLOW_ID         | Which flow id to use in the login page                                                                                  | **sign-up-or-in** |
| DESCOPE_BASE_URL        | Custom Descope base URL                                                                                                 | **""**            |
| DESCOPE_THEME           | **"light"** - Light theme</br>**"dark"** - Dark theme</br>**"os"** - Auto select a theme based on the OS theme settings | **light**         |
| DESCOPE_DEBUG_MODE      | **"true"** - Enable debugger</br>**"false"** - Disable flow debugger                                                    | **false**         |
| DESCOPE_STEP_UP_FLOW_ID | Step up flow ID to show to logged in user (via button). e.g. "step-up". Button will be hidden if not provided           | **""**            |
| DESCOPE_TELEMETRY_KEY   | **String** - Telemetry public key provided by Descope Inc                                                               | **""**            |
|                         |                                                                                                                         |                   |

Example for `.env` file template:

```
# Your project ID
DESCOPE_PROJECT_ID="<Project-ID>"
# Login flow ID
DESCOPE_FLOW_ID=""
# Descope base URL
DESCOPE_BASE_URL=""
# Set flow theme to dark
DESCOPE_THEME=dark
# Enable debugger
DESCOPE_DEBUG_MODE=true
# Show step-up flow for logged in user
DESCOPE_STEP_UP_FLOW_ID=step-up
# Telemetry key
DESCOPE_TELEMETRY_KEY=""
```
