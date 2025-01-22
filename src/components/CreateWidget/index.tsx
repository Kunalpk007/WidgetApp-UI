import React, { useState } from 'react';
import Button from '@mui/material/Button';
import './createWidget.css';
import ModalWidget from '../ModalComponent';

const CreateWidget = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const [formData] = useState({
    name: '',
    price: '',
    description: '',
  });

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
      + Create New Widget
      </Button>
      <ModalWidget open={open} setOpen={setOpen} isEdit={false} Data={formData} ></ModalWidget>
    </>
  );
};

export default CreateWidget;