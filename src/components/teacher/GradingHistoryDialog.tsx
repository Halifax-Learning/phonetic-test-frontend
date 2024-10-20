import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import React from 'react'
import { AutoGradingHistory, TeacherGradingHistory } from '../../models/interface'

interface GradingHistoryDialogProps {
    open: boolean
    onClose: () => void
    history: (TeacherGradingHistory | AutoGradingHistory)[] // Union type for history
}

// Type guard for AutoGradingHistory
const isAutoGradingHistory = (entry: any): entry is AutoGradingHistory => {
    return 'autoGradingHistoryId' in entry
}

const GradingHistoryDialog: React.FC<GradingHistoryDialogProps> = ({ open, onClose, history }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isAutoGradingHistory(history) ? 'Auto Grading History' : 'Grading History'}
            </DialogTitle>
            <DialogContent dividers>
                {history.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                        <Typography variant="body1" color="textSecondary">
                            No History
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {isAutoGradingHistory(history[0]) ? (
                                        <>
                                            <TableCell sx={{ color: 'primary.main', width: '40%' }}>
                                                Model Version
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '20%' }}>
                                                User Answer Transcription
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '15%' }}>
                                                Auto Evaluation (Score)
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '25%' }}>
                                                Date
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell sx={{ color: 'primary.main', width: '15%' }}>
                                                Teacher
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '15%' }}>
                                                Evaluation
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '25%' }}>
                                                Date
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', width: '45%' }}>
                                                Feedback
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((entry) =>
                                    isAutoGradingHistory(entry) ? (
                                        <TableRow key={entry.autoGradingHistoryId}>
                                            <TableCell sx={{ width: '40%' }}>
                                                {entry.modelName}
                                            </TableCell>
                                            <TableCell sx={{ width: '20%' }}>
                                                {entry.transcription}
                                            </TableCell>
                                            <TableCell sx={{ width: '15%' }}>
                                                {entry.autoEvaluation}
                                            </TableCell>
                                            <TableCell sx={{ width: '25%' }}>
                                                {format(new Date(entry.createdAt), 'PPpp')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <TableRow key={entry.teacherGradingHistoryId}>
                                            <TableCell sx={{ width: '15%' }}>
                                                {`${entry.teacherAccount.firstName} ${entry.teacherAccount.lastName}`}
                                            </TableCell>
                                            <TableCell sx={{ width: '15%' }}>
                                                {entry.teacherEvaluation ? 'Correct' : 'Incorrect'}
                                            </TableCell>
                                            <TableCell sx={{ width: '25%' }}>
                                                {format(new Date(entry.createdAt), 'PPpp')}
                                            </TableCell>
                                            <TableCell sx={{ width: '45%' }}>
                                                {entry.teacherComment}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default GradingHistoryDialog
