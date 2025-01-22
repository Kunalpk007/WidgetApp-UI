import React from 'react'
import './App.css'
import Stack from '@mui/material/Stack'

import WidgetList from './components/WidgetList'
import CreateWidget from './components/CreateWidget'

const App = (): JSX.Element => {
  return (<Stack>
    {/* <CreateWidget></CreateWidget> */}
    <WidgetList></WidgetList>
    
  </Stack>)
}

export default App
