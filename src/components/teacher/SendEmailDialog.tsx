import {
    Alert,
    AlertColor,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Radio,
    Snackbar,
    TextField,
} from '@mui/material'
import { format } from 'date-fns'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useState } from 'react'

import { Assessment } from '../../models/interface'
import { sendAssessmentResult } from '../../services/assessment'

interface SendEmailDialogProps {
    open: boolean
    onClose: () => void
    assessment: Assessment
}

const SendEmailDialog = ({ open, onClose, assessment }: SendEmailDialogProps) => {
    const [teacherComment, setTeacherComment] = useState('')
    const [selectedOption, setSelectedOption] = useState('pdfOnly')
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [onSendMsg, setOnSendMsg] = useState<{ message: string; severity: AlertColor }>({
        message: '',
        severity: 'success',
    })
    const [sendingInProgress, setSendingInProgress] = useState(false)

    const composeGreetings = () => {
        const greeting = `Hello ${assessment.testTaker.firstName},

Your assessment result is ready.
`
        return greeting
    }

    const composeAssessmentHeading = () => {
        const assessmentHeading = `
Assessment     : ${assessment.assessmentType.assessmentTypeName}
Submission Time: ${format(new Date(assessment.assessmentSubmissionTime), 'PPpp')}
`
        return assessmentHeading
    }

    const composeTestTable = () => {
        let table = `
| Test Name                  | Correct Answers | Total Questions | Score   |
|----------------------------|-----------------|-----------------|---------|
`

        for (const test of assessment.tests) {
            const testName = test.testType.testTypeName.padEnd(26, ' ')

            const correctAnswers = test.teacherScore || 0
            const correctAnswersStr = correctAnswers.toString().padStart(8, ' ').padEnd(15, ' ')

            const numQuestions = test.testType.numQuestions
            const numQuestionsStr = numQuestions.toString().padStart(8, ' ').padEnd(15, ' ')

            const percentage = (correctAnswers / numQuestions) * 100
            const percentageStr = (percentage.toFixed(2) + '%').padStart(7, ' ')
            table += `| ${testName} | ${correctAnswersStr} | ${numQuestionsStr} | ${percentageStr} |\n`
        }

        return table
    }

    const greeting = composeGreetings()
    const assessmentHeading = composeAssessmentHeading()
    const testTable = composeTestTable()
    const template = greeting + assessmentHeading + testTable

    const footer = '\n\nRegards,\nHalifax Learning Centre'

    const onSendAssessmentResult = async () => {
        setOnSendMsg({ message: 'Sending result to student...', severity: 'info' })
        setOpenSnackbar(true)

        try {
            let emailContent
            if (selectedOption === 'pdfOnly') {
                emailContent = greeting + 'Please see the attached PDF file.' + footer
            } else {
                emailContent = teacherComment
                    ? template + '\n\nAdditional Comments:\n\n' + teacherComment + footer
                    : template + footer
            }

            const doc = selectedOption === 'emailOnly' ? null : generatePDF()

            setSendingInProgress(true)
            await sendAssessmentResult(assessment!.testTaker.email, emailContent, doc)
            setSendingInProgress(false)
            setOnSendMsg({
                message: 'Result sent successfully.',
                severity: 'success',
            })
            onClose()
        } catch {
            setOnSendMsg({
                message: 'Failed to send the result. Please try again.',
                severity: 'error',
            })
        }
    }

    const generatePDF = (preview = false) => {
        const doc = new jsPDF()

        // Add title
        doc.setFontSize(18)
        doc.text('Assessment Result', 14, 25)

        // Add greeting
        doc.setFontSize(12)
        const lines = doc.splitTextToSize(greeting + assessmentHeading, 180)
        doc.text(lines, 14, 40)

        // Add table
        const tableData = assessment!.tests.map((test) => {
            const correctAnswers = test.teacherScore || 0
            const numQuestions = test.testType.numQuestions
            const percentage = (correctAnswers / numQuestions) * 100
            const percentageStr = percentage.toFixed(2) + '%'

            return [
                test.testType.testTypeName,
                correctAnswers.toString(),
                numQuestions.toString(),
                percentageStr,
            ]
        })

        doc.autoTable({
            head: [['Test Name', 'Correct Answers', 'Total Questions', 'Score']],
            body: tableData,
            startY: 70,
            headStyles: { fontSize: 12, halign: 'center' },
            styles: { fontSize: 11 },
            columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' },
            },
        })

        // Add additional comments
        if (teacherComment) {
            const additionalComments = 'Additional Comments:\n\n' + teacherComment
            const additionalCommentsLines = doc.splitTextToSize(additionalComments, 180)
            doc.text(additionalCommentsLines, 14, 120)
        }

        // Save the PDF
        if (preview) {
            doc.save('assessment_result.pdf')
        }

        return doc
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value)
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Send Assessment Result to Student</DialogTitle>

                <DialogContent>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {template}
                    </pre>
                    <TextField
                        label="Additional Comments"
                        multiline
                        fullWidth
                        value={teacherComment}
                        onChange={(e) => setTeacherComment(e.target.value)}
                        slotProps={{ input: { style: { fontFamily: 'monospace' } } }}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={selectedOption === 'pdfOnly'}
                                    onChange={handleRadioChange}
                                    value="pdfOnly"
                                />
                            }
                            label="Include score in attached pdf only."
                        />
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={selectedOption === 'emailOnly'}
                                    onChange={handleRadioChange}
                                    value="emailOnly"
                                />
                            }
                            label="Include score in email only."
                        />
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={selectedOption === 'both'}
                                    onChange={handleRadioChange}
                                    value="both"
                                />
                            }
                            label="Include score in both attached pdf and email."
                        />
                    </FormGroup>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onSendAssessmentResult} disabled={sendingInProgress}>
                        Send
                    </Button>
                    <Button
                        color="info"
                        onClick={() => generatePDF(true)}
                        disabled={sendingInProgress}
                    >
                        Preview PDF
                    </Button>
                    <Button color="warning" onClick={onClose} disabled={sendingInProgress}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={onSendMsg.severity}>
                    {onSendMsg.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SendEmailDialog
