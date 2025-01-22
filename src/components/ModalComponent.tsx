import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { createWidget, updateWidget } from '../lib/apiConnect';
import '../components/CreateWidget/createWidget.css';
import SimpleSnackbar from './Snackbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export interface ModalWidgetProps {
open: boolean;
setOpen: (open: boolean) => void;
isEdit: boolean;
Data: any;
}

const ModalWidget: React.FC<ModalWidgetProps> = ({ open , setOpen, isEdit, Data} ) => {
    
  const handleClose = () => {
      setOpen(false);
        setError(null);
        setSuccess(null);
  }

  const [error, setError] : any = useState(null);
  const [success, setSuccess] : any = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);



  const [formData, setFormData] = useState({
    name: Data.name,
    price: Data.price,
    description: Data.description,
  });

  const handleChange = (event:any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const createWidgetCall = async (event:any) => {
        try{
        const result = await createWidget(formData);
        console.log('Result:', result.data, result.status);
        if (result.status === 201) {
            setSuccess('Widget created successfully!', result.data);
            setOpen(false);
        setError(null);
        } else {
            setError(result.data);
        }
        // result.status === 201 ? setSuccess('Widget created successfully!', result.data) : setError(result.data);
        // setOpenSnackbar(true);
        // window.location.reload();
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
    }

    const updateWidgetCall = async (event:any) => {
        
        try{
        const result = await updateWidget(formData);
        console.log('Result:', result.data);
        if (result.status === 200) {
            setSuccess('Widget updated successfully!', result.data);
            setOpen(false);
            setError(null);
            } else {
            setError(result.data);
        }
        // result.status == 201 ? setSuccess('Widget created successfully!', result) : setError(result.data);
        setOpenSnackbar(true);
        window.location.reload();
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
    }

    const validateForm = () => {
        if (formData.name.length < 3 || formData.name.length > 100) {
          setError('Name must be between 3 and 100 characters.');
          return false;
        }
        if (formData.description.length < 5 || formData.description.length > 1000) {
          setError('Description must be between 5 and 1000 characters.');
          return false;
        }
        if (formData.price < 1 || formData.price > 20000 || !/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
          setError('Price must be between 1 and 20000 with up to 2 decimal places.');
          return false;
        }
        return true;
      };

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    if (!validateForm()) {
        setOpenSnackbar(true);
        return;
      }
      setOpenSnackbar(true);
    isEdit ? (await updateWidgetCall(event) ) : await createWidgetCall(event);
    window.location.reload();
    // handleClose();
  };

  return (
    <div>
          <Typography style={{position: 'absolute', top: '0'}} >

          <SimpleSnackbar  open={openSnackbar} handleClose={setOpenSnackbar} error={error} success={success}></SimpleSnackbar>
          </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{...style}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEdit ? 'Edit Item': 'Add New Item'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              id="outlined-basic" 
              label="Name" 
              name='name'
              value= {formData.name}
              onChange={handleChange}
              variant="outlined" 
              fullWidth 
              disabled={isEdit}
              margin="normal" 
            />
                        <TextField 
              id="outlined-basic" 
              label="Price" 
              name='price'
              value={formData.price}
              onChange={handleChange}
              variant="outlined" 
              fullWidth 
              margin="normal" 
            />
                        <TextField 
              id="outlined-basic" 
              label="Description"
              name='description' 
              value={formData.description}
              onChange={handleChange}
              variant="outlined" 
              fullWidth 
              margin="normal" 
            />
            {/* Add more fields as needed */}
            <Grid container justifyContent="center">
            
            <Button variant="contained" type="submit">
              Save
            </Button>
            </Grid>
            <Button className ='cancel-button' 
            variant="outlined" 
            onClick={handleClose}
            style={{ position: 'absolute',borderRadius: '5px', backgroundColor: '#ac1212', color: 'white' }}>
              X
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalWidget;
