import {useThemeTweaker} from 'theme-tweaker';
import React from 'react';

type Theme = {my: string};


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
