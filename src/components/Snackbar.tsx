import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

export default function SimpleSnackbar( {open, handleClose, error, success } : any) {

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

    function handleCloseSnackbar() {
        handleClose(false);
    }

  return (
    <div>
      
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Note archived"
        action={action}
        >
             {error ? (
                      <Alert onClose={handleCloseSnackbar}  severity="error" sx={{ width: '100%' }}>
                        {error}
                      </Alert>
                    ) : (
                      <Alert severity="success" sx={{ width: '100%' }}>
                        {success}
                      </Alert>
                    )}
        </Snackbar>
      
    </div>
  );
}
