import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import WarningIcon from '@mui/icons-material/Warning'
import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'

interface ConfirmationModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onConfirm }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: 'sm',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h2" sx={{ fontSize: '1.25rem' }}>
                        Warning
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.primary">
                    You have not recorded an answer for this question. Are you sure you want to
                    proceed to the next question?
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        startIcon={<CloseIcon />}
                        sx={{ mr: 2, fontSize: '1rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        startIcon={<CheckCircleIcon />}
                        sx={{ fontSize: '1rem' }}
                    >
                        Proceed
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ConfirmationModal
