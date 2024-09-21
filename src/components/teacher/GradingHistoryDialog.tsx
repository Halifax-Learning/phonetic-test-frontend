import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import React from 'react'
import { TeacherGradingHistory } from '../../models/interface'

interface GradingHistoryDialogProps {
    open: boolean
    onClose: () => void
    history: TeacherGradingHistory[]
}

const GradingHistoryDialog: React.FC<GradingHistoryDialogProps> = ({ open, onClose, history }) => {
    console.log('Dialog Props:', { open, history }) // Log the props

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Grading History</DialogTitle>
            <DialogContent>
                <List>
                    {history.map((entry) => (
                        <ListItem key={entry.teacherGradingHistoryId}>
                            <ListItemText
                                primary={`Teacher: ${entry.teacherAccount.firstName} ${entry.teacherAccount.lastName}`}
                                secondary={`Evaluation: ${entry.teacherEvaluation ? 'Positive' : 'Negative'}, Comment: ${entry.teacherComment}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GradingHistoryDialog
