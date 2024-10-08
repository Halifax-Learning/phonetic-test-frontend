import CloseIcon from '@mui/icons-material/Close'
import HelpIcon from '@mui/icons-material/Help'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import AudioPlayerWithIcon from './AudioPlayerWithIcon'

interface InstructionDialogProps {
    open: boolean
    onClose: () => void
    showAudioVersion: boolean
    instructionAudioBlobUrl?: string
    customPoint1Text?: string
}

interface InstructionContentProps {
    showAudioVersion: boolean
    instructionAudioBlobUrl?: string
    customPoint1Text?: string
}

const InstructionDialog: React.FC<InstructionDialogProps> = ({
    open,
    onClose,
    showAudioVersion,
    instructionAudioBlobUrl,
    customPoint1Text,
}) => {
    return (
        <Dialog onClose={onClose} aria-labelledby="instruction" open={open} maxWidth="md">
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    backgroundColor: '#e8ddcc',
                }}
                id="instruction"
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <HelpIcon sx={{ mr: 1 }} />
                    Instruction
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            color: theme.palette.primary.main,
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent
                dividers
                sx={{
                    backgroundColor: '#fff8ed',
                }}
            >
                {/* Background layer */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 'calc(100% - 2rem)',
                        height: 'calc(100% - 2rem)',
                        background: '#fff8ed', // Light brown to dark brown
                        zIndex: -1,
                        top: '1rem',
                        left: '1rem',
                        opacity: 1, // 20% opacity
                        borderRadius: '8px',
                    }}
                />
                <InstructionContent
                    showAudioVersion={showAudioVersion}
                    instructionAudioBlobUrl={instructionAudioBlobUrl}
                    customPoint1Text={customPoint1Text}
                />
            </DialogContent>
        </Dialog>
    )
}

const InstructionContent: React.FC<InstructionContentProps> = ({
    showAudioVersion,
    instructionAudioBlobUrl,
    customPoint1Text = 'I\'ll say two sounds, you tell me the word, like this: "/m/ /oo/" - "moo".',
}) => (
    <>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>1. {showAudioVersion ? 'Listen to the Audio:' : 'Read the Sound Card:'}</strong>
            <br />
            For each question, you will{' '}
            {showAudioVersion
                ? 'see an audio file. Play the audio and listen carefully.'
                : 'see a sound card. Read the sound card carefully.'}
            <br />
            For example:
            <br />
            <AudioPlayerWithIcon instructionAudioSrc={instructionAudioBlobUrl ?? ''} />
            {customPoint1Text}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>2. Record Your Answer:</strong>
            <br />
            • When you are ready to answer, click the &quot;Record Now&quot; button.
            <br />• Speak your answer clearly.
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>3. Review Your Answer:</strong>
            <br />
            • After finishing, click &quot;Stop Recording&quot; to end your answer.
            <br />• You can listen to your recorded answer to ensure you are satisfied with it.
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>4. Revise Your Answer (Optional):</strong>
            <br />
            • If you would like to change your answer, click &quot;Record Again&quot; to start a new
            recording.
            <br />• <em>Important:</em> If you record a new answer, your previous answer will be
            lost.
        </Typography>
    </>
)

export default InstructionDialog
export { InstructionContent }
