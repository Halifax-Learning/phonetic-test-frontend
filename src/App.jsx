import { Box, Button, Container, List, ListItemButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

import { getAudio } from './services/audio'

const App = () => {
    const [displayTest, setDisplayTest] = useState(false)
    const [questionNo, setQuestionNo] = useState(1)
    const [audioUrl, setAudioUrl] = useState(null)
    const [isNewQuestion, setIsNewQuestion] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })

    const questions = ['/k/ + /aw/', '/t/ + /o_e/', '/t/ + /a_e/', '/sh/ + /oo/', '/f/ + /ee/']
    const audio_filepaths = [
        'questions/analysis/question_k_aw.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
    ]

    useEffect(() => {
        const fetchAudio = async () => {
            const fetched_audio = await getAudio(audio_filepaths[0])
            setAudioUrl(fetched_audio)
        }
        fetchAudio()
    }, [])

    const TestList = () => {
        return (
            <Box>
                <Typography variant="h4">Choose A Test</Typography>
                <List>
                    <ListItemButton onClick={() => setDisplayTest(true)}>Synthesis</ListItemButton>
                    <ListItemButton>Analysis</ListItemButton>
                    <ListItemButton>Listening</ListItemButton>
                    <ListItemButton>Single Phoneme Recognition</ListItemButton>
                </List>
            </Box>
        )
    }

    const onStartRecording = () => {
        setIsNewQuestion(false)
        setIsRecording(true)
        startRecording()
    }

    const onStopRecording = () => {
        setIsRecording(false)
        stopRecording()
    }

    const onClickNextQuestion = async () => {
        setQuestionNo(questionNo + 1)
        const fetched_audio = await getAudio(audio_filepaths[questionNo])
        setAudioUrl(fetched_audio)
    }

    const Test = () => {
        return (
            <Box>
                <Typography variant="h2">Synthesis</Typography>
                <Typography style={{ marginBottom: 50 }}>
                    Instructions: I&apos;ll say two sounds, you tell me the word, like this: /m/ + /oo/ =
                    /moo/
                </Typography>
                <Typography variant="h4">Question {questionNo} </Typography>
                <Typography>{questions[questionNo - 1]}</Typography>
                <audio controls>
                    <source src={audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
                <Box>
                    <Box>
                        {!isRecording ? (
                            <Button onClick={onStartRecording}>Record Your Answer</Button>
                        ) : (
                            <Button onClick={onStopRecording}>Finish Your Answer</Button>
                        )}
                    </Box>
                    {!isRecording && mediaBlobUrl && !isNewQuestion && (
                        <audio controls src={mediaBlobUrl}></audio>
                    )}
                </Box>
                {questionNo < questions.length ? (
                    <Button onClick={onClickNextQuestion}>Next Question</Button>
                ) : (
                    <Button
                        onClick={() => {
                            setDisplayTest(false)
                            setQuestionNo(1)
                        }}
                    >
                        Finish Test
                    </Button>
                )}
            </Box>
        )
    }

    return <Container>{displayTest ? <Test /> : <TestList />}</Container>
}

export default App
