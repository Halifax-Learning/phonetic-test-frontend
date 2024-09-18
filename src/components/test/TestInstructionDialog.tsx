import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'

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
            • If you would like to change your answer, click &quot;Record Now&quot; again to start a
            new rec ording.
            <br />• <em>Important:</em> If you record a new answer, your previous answer will be
            lost.
        </Typography>
    </>
)

export default InstructionDialog
export { InstructionContent }
