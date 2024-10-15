import ProgressBarIcon from '@mui/icons-material/BugReport'
import { Box, LinearProgress, Tooltip, Typography } from '@mui/material'
import React from 'react'

interface ProgressBarProps {
    currentQuestionIndex: number
    numQuestions: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestionIndex, numQuestions }) => {
    const progressValue = ((currentQuestionIndex + 1) / numQuestions) * 100

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '15px 10px',
                border: '1px solid',
                borderColor: 'primary.main',
                boxShadow: 1,
            }}
        >
            <Box sx={{ width: '100%' }}>
                <Tooltip title="Current Progress">
                    <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{
                            height: 12,
                            borderRadius: 5,
                            backgroundColor: 'text.secondary',
                        }}
                    />
                </Tooltip>

                <Box
                    sx={{
                        position: 'absolute',
                        left: `calc((100% - 20px) * ${progressValue / 100} - 20px)`,
                        top: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ProgressBarIcon
                        sx={{
                            color: 'primary.dark',
                            transform: 'rotate(90deg)',
                            fontSize: 40,
                            animation: 'spin 2s linear infinite',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(90deg)' },
                                '25%': { transform: 'rotate(95deg)' },
                                '75%': { transform: 'rotate(85deg)' },
                                '100%': { transform: 'rotate(90deg)' },
                            },
                        }}
                    />
                    <Typography
                        variant="subtitle1"
                        color="primary.dark"
                        align="center"
                        sx={{
                            position: 'relative',
                            transform: 'translateX(-100px)',
                            backgroundColor: 'white',
                            padding: '2px 10px',
                            borderRadius: '15px',
                            boxShadow: 2,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '98%',
                                marginTop: '-5px',
                                borderWidth: '5px',
                                borderStyle: 'solid',
                                borderColor: 'transparent transparent transparent white',
                            },
                        }}
                    >
                        {Math.round(progressValue)}%
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default ProgressBar
