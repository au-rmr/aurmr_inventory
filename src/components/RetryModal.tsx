import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const retryBtnStyle = {
    marginRight: '15px'
}

interface RetryModalProps {
    onRetry: () => void,
    onAbort: () => void
}

export default function RetryModal(props: RetryModalProps) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Grasp failed...
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <p>Authorize retry?</p>
            <Button onClick={props.onRetry} style={retryBtnStyle} variant="contained" color="success" startIcon={<RefreshIcon />}>
                Retry
            </Button>
            <Button onClick={props.onAbort} variant="outlined" color="error" startIcon={<BlockIcon />}>
                Abort
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}