# theme-tweaker

> Use to develop your Theme object dynamically

[![NPM](https://img.shields.io/npm/v/theme-tweaker.svg)](https://www.npmjs.com/package/theme-tweaker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save theme-tweaker
```

## Usage

### Basic Example
```tsx
// index.tsx
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {createThemeTweaker} from 'theme-tweaker'

export type Theme = {mode: "light" | "dark"};
const theme: Theme = {mode: "light"};

const Provider = createThemeTweaker();

ReactDOM.render(
    <Provider theme={theme}>
        <App />
    </Provider>
, document.getElementById('root'))

```

## Using a third party library (Material UI for example)
### Pass that library theme provider to the createThemeTweaker function and use the returned Provider the same way.
```tsx
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {theme} from './theme/theme';
import MuiProvider from '@material-ui/styles/ThemeProvider';
import { createThemeTweaker } from './theme/themeTweaker/themeTweaker';

const isDev = process.env.REACT_APP_ENV === "development";

const ThemeProvider = isDev ? createThemeTweaker(MuiProvider) : MuiProvider;

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
,
  document.getElementById('root')
);
```

## Modifying your theme from a component
```tsx
import {useThemeTweaker} from 'theme-tweaker';
import React from 'react';
import {Theme} from './index';

const App = () => {
  const {theme, setThemeProp} = useThemeTweaker<Theme>();

  return (
    <div>
      <button onClick={() => setThemeProp("mode", "dark")}>Change</button>
      {JSON.stringify(theme)}
    </div>
  );
}

export default App
```
## License

MIT © [guygolanIL](https://github.com/guygolanIL)
