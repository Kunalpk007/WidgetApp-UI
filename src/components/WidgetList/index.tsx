import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

import WidgetDisplay from '../WidgetDisplay'
import { fetchAllWidgets, getWidgetData, Widget } from '../../lib/apiConnect'
import CreateWidget from '../CreateWidget'
import { TextField, Button } from '@mui/material'
import SimpleSnackbar from '../Snackbar'

const WidgetList = (): JSX.Element => {
  const [widgets, setWidgets] = useState<Widget[]>([])
    // const [widgetName, setWidgetName] : any = useState('');
    const [getname, setgetname] = useState('');
      const [error, setError] : any = useState(null);
      const [success, setSuccess] : any = useState(null);
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const getallWidgets = async () => {
        fetchAllWidgets()
        .then(setWidgets)
          .catch((error) => console.error('Error fetching widgets', error));
      }

  useEffect(() => {
    getallWidgets();
  }, [])

  const handleGetNameChange = async (event :any ) => {
    setgetname(event.target.value);
  };

  const getWidget = async () => {
    if (!getname.trim()) {
      setError('Name cannot be empty.');
      setOpenSnackbar(true);
      return;
    }
    // setWidgetName(null);
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages
    
    try{

      // const name = getname;
      // console.log('Name:',name);
      
      const result = await getWidgetData(getname);
      
      console.log('Result:', result);
      if (result.status === 200) {
        setSuccess('Widget found '+result.data.name);
        setWidgets([result.data]);
        setgetname('');
      } else {
        setError(result.data);
        setWidgets([]);
      }
      setOpenSnackbar(true);
      // result.status == 200 ? setWidgets([result.data])  : (setError(result.data)  setWidgets([]));
    } catch (error:any) {
      if (error.response && error.response.status === 400) {
        setError('Bad Request: ' + (error.response.data && error.response.data.message)); 
      } else if (error.response && error.response.status === 409) {
        setError('Widget already exists.');
      } else {
        setError('An unexpected error occurred.');
      }
      setOpenSnackbar(true);
    }

    // console.log("result:",result);
  }

  return (
    <Stack spacing={4} sx={{ margin: 'auto', maxWidth: 900, paddingTop: '4em', width: '100%' }}>

      <Grid container justifyContent="center" spacing={3} >
        <Grid item xs={9}>
      <TextField 
              id="outlined-basic" 
              label="Name" 
              name='getname'
              value={getname}
              onChange={handleGetNameChange}
              variant="outlined" 
              fullWidth 
              margin="normal" 
              required 
            />
            </Grid>
            <Grid item xs={3}>
              <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                <Button variant="contained" onClick={getWidget}>
                  Get Widget By Name
                </Button>
              </Grid>
              </Grid>
            <Button variant="contained" onClick={getallWidgets}>
        Get All Widgets
      </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <CreateWidget></CreateWidget>
      </Grid>
      <h2 style={{ textAlign: 'center' }} >
        List of widgets:
      </h2>
      <Grid container justifyContent="center" spacing={4} sx={{ paddingRight: 4, width: '100%' }}>
        {widgets.map((current, index) => <WidgetDisplay key={index} widget={current} />)}
      </Grid>
      <SimpleSnackbar open={openSnackbar} handleClose={setOpenSnackbar} error={error} success={success}></SimpleSnackbar>
    </Stack>
  )
}

export default WidgetList
