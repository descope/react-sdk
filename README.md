# web-react-sdk
This library lets you consume your login pages created by Descope console-app in your application
Under the hood, it uses [web-react-sdk1](https://github.com/descope/web-js-sdk)

## Usage
### Install the package
```bash
npm install @descope/web-react-sdk
```

### Render it in your application
```js
import Descope from '@descope/web-react-sdk'

const App = () => {

    return (
        <Descope 
            projectId="myProjectId" 
            flowId="myFlowId" 
            onSuccess={(e) => console.log('Logged in!')}
            onError={(e) => console.log('Could not logged in!')}
        >
    )
}
```

TODO:
- decide about the callbacks event data & structure