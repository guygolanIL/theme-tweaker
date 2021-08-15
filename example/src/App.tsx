import {useThemeTweaker} from 'theme-tweaker';
import React from 'react';
import {Theme} from './index';

const App = () => {
  const {theme, setThemeProp} = useThemeTweaker<Theme>();
  
  return (
    <div>
      <button onClick={() => setThemeProp("my", "edited theme")}>Change</button>
      {JSON.stringify(theme)}
    </div>
  );
}

export default App
