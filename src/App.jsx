import React, { useEffect } from 'react';
import './index.css';

const App = () => {
  useEffect(() => {
    import('./script.js');
  }, []);

};
  export default App;