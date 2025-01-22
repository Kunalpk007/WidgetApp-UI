import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import './widgetDisplay.css'

import { deleteWidget, Widget } from '../../lib/apiConnect'
import { Box, IconButton } from '@mui/material'
import ModalWidget from '../ModalComponent'

export interface DisplayWidgetProps {
  widget: Widget,
}



const DisplayWidget = ({ widget }: DisplayWidgetProps): JSX.Element => {
  
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
  const { description, name, price } = widget

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this widget?');
    if (!confirmed) {
      return;
    }
    try{
      
       const result = await deleteWidget(name);
           console.log('Result:', result);         
          result.status === 202 ?  window.location.reload() : alert('An unexpected error occurred.');
        } catch (error:any) {
          if (error.response && error.response.status === 400) {
            alert('Bad Request: ' + (error.response.data && error.response.data.message));
          } else {
            alert('An unexpected error occurred.');
          }
        }
    
  }

  return (
    <Grid item xs={6}>
      <Card>
        <CardContent >
        <Box display="flex" justifyContent="space-between" alignItems="center">            <Typography component="div" gutterBottom variant="h4">
              {name}
            </Typography>
            <Box>
            <IconButton onClick={handleOpen} color="primary" >
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
          </Box>
          </Box>
          <Stack spacing={2}>
            <Typography component="div" gutterBottom variant="h5">
              ${price}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
            </Stack>
        </CardContent>
      </Card>
      <ModalWidget open={open} setOpen={setOpen} isEdit={true} Data={widget}></ModalWidget>
  </Grid>)
}

export default DisplayWidget
