import * as React from 'react';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

import Konva from 'konva';
import { Stage, Layer, Circle, Rect, Text, Image } from 'react-konva';

const CIRCLE_RADIUS = 20;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const retryBtnStyle = {
    marginRight: '15px',
    marginTop: '15px'
}

interface GraspPointSelectionModalProps {
    onRetry: () => void,
    onAbort: () => void,
    onTargetSelected: (position: any) => void,
    imageData: string,
}

export default function GraspPointSelectionModal(props: GraspPointSelectionModalProps) {
  const cursorCircleRef = useRef<any>(null);
  const [cursorCirclePos, setCursorCirclePos] = React.useState<any>({x: 0.0, y: 0.0});
  const [goalCirclePos, setGoalCirclePos] = React.useState<any>({x: 0.0, y: 0.0});
  const [showCursorCircle, setShowCursorCircle] = React.useState(false);
  const [showGoalCircle, setShowGoalCircle] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  let image = new window.Image();
  image.src = props.imageData;

  let onMouseEnter = () => {
    setShowCursorCircle(true);
  }

  let onMouseLeave = () => {
    setShowCursorCircle(false);
  }

  let onMouseMove = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setCursorCirclePos(pos);
  }

  let onMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setShowGoalCircle(true);
    setGoalCirclePos(pos);
    props.onTargetSelected(pos);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Stage width={800} height={window.innerHeight - 200} style={{cursor: 'none'}}>
                <Layer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove} onMouseDown={onMouseDown}>
                    <Image image={image} x={-150} y={0} />
                    <Circle radius={CIRCLE_RADIUS} fill='red' stroke='black' strokeWidth={3} opacity={0.4} x={305} y={250} />
                    {showGoalCircle ? (
                        <Circle radius={CIRCLE_RADIUS}
                                fill='white' 
                                stroke='black' 
                                strokeWidth={3} 
                                opacity={0.75} 
                                x={goalCirclePos.x} 
                                y={goalCirclePos.y} />
                    ) : null}
                    {showCursorCircle ? (
                        <Circle ref={cursorCircleRef}
                                radius={CIRCLE_RADIUS}
                                fill='white' 
                                stroke='black' 
                                strokeWidth={1} 
                                opacity={0.75} 
                                x={cursorCirclePos.x} 
                                y={cursorCirclePos.y} />
                    ) : null}
                </Layer>
            </Stage>
            <Button onClick={props.onRetry} style={retryBtnStyle} variant="contained" color="success" startIcon={<RefreshIcon />}>
                Retry
            </Button>
            <Button onClick={props.onAbort} style={retryBtnStyle}  variant="outlined" color="error" startIcon={<BlockIcon />}>
                Abort
            </Button>
        </Box>
      </Modal>
    </div>
  );
}