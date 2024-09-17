import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface InstructionDialogProps {
    open: boolean
    onClose: () => void
    showAudioVersion: boolean
    customPoint1Text: string
}

interface InstructionContentProps {
    showAudioVersion: boolean
    customPoint1Text?: string
}

const InstructionDialog: React.FC<InstructionDialogProps> = ({
    open,
    onClose,
    showAudioVersion,
    customPoint1Text,
}) => {
    return (
        <Dialog onClose={onClose} aria-labelledby="instruction" open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="instruction">
                Instruction
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.primary.main,
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <InstructionContent
                    showAudioVersion={showAudioVersion}
                    customPoint1Text={customPoint1Text}
                />
            </DialogContent>
        </Dialog>
    )
}

const InstructionContent: React.FC<InstructionContentProps> = ({
    showAudioVersion,
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
            {customPoint1Text}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>2. Record Your Answer:</strong>
            <br />
            • When you're ready to answer, click the "Record Now" button.
            <br />• Speak your answer clearly.
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>3. Review Your Answer:</strong>
            <br />
            • After finishing, click "Stop Recording" to end your answer.
            <br />• You can listen to your recorded answer to ensure you're satisfied with it.
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            <strong>4. Revise Your Answer (Optional):</strong>
            <br />
            • If you'd like to change your answer, click "Record Now" again to start a new rec
            ording.
            <br />• <em>Important:</em> If you record a new answer, your previous answer will be
            lost.
        </Typography>
    </>
)

export default InstructionDialog
export { InstructionContent }
