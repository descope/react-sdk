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

```js
import { Descope } from '@descope/react-sdk'

const App = () => {
    return (
        {...}
        <Descope 
            flowId="myFlowId" 
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in!')}
        >
    )
}
```

TODO:
- decide about the callbacks event data & structure