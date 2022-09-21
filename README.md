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
You can use default flows or provide flow id directly to the Descope component

##### Default flows

```js
// you can choose flow to run from the following
// import { SignIn } from '@descope/react-sdk'
// import { SignUp } from '@descope/react-sdk'
import { SignUpOrIn } from '@descope/react-sdk'

const App = () => {
    return (
        {...}
        <SignUpOrIn 
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in!')}
        />
    )
}
```

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