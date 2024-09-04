import { Box, Button, Container, List, ListItemButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

import { getAudio, saveAudios } from './services/audio'

const App = () => {
    const [displayTest, setDisplayTest] = useState(false)
    const [questionNo, setQuestionNo] = useState(1)
    const [audioUrl, setAudioUrl] = useState(null)
    const [recordAudioUrls, setRecordAudioUrls] = useState({
        answer_1: null,
        answer_2: null,
        answer_3: null,
        answer_4: null,
        answer_5: null,
    })
    const [isNewQuestion, setIsNewQuestion] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true })

    const questions = ['/k/ + /aw/', '/t/ + /o_e/', '/t/ + /a_e/', '/sh/ + /oo/', '/f/ + /ee/']
    const questionAudioFilepaths = [
        'questions/analysis/question_k_aw.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
        'questions/analysis/question_t_oe.mp3',
    ]

    const answerAudioFilepaths = [
        'tests/2024-09-03/test_id/answer_1.mp3',
        'tests/2024-09-03/test_id/answer_2.mp3',
        'tests/2024-09-03/test_id/answer_3.mp3',
        'tests/2024-09-03/test_id/answer_4.mp3',
        'tests/2024-09-03/test_id/answer_5.mp3',
    ]

    useEffect(() => {
        const fetchAudio = async () => {
            const fetched_audio = await getAudio(questionAudioFilepaths[0])
            setAudioUrl(fetched_audio)
        }
        fetchAudio()
    }, [])

    useEffect(() => {
        if (mediaBlobUrl) {
            setRecordAudioUrls({ ...recordAudioUrls, ['answer_' + questionNo]: mediaBlobUrl })
        }

        // State hook is asynchronous, so the updated state of recordAudioUrls may not be available immediately in the console.log statement below
        console.log(
            'useEffect when mediaBlobUrl is updated; Recorded Audio URLs: ',
            recordAudioUrls,
            'last recorded audio URL: ',
            mediaBlobUrl
        )
    }, [mediaBlobUrl])

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
        setIsNewQuestion(true)
        setQuestionNo(questionNo + 1)
        const fetched_audio = await getAudio(questionAudioFilepaths[questionNo])
        setAudioUrl(fetched_audio)

        console.log(
            'onClickNextQuestion; Recorded Audio URLs: ',
            recordAudioUrls,
            'last recorded audio URL: ',
            mediaBlobUrl
        )
    }

    const onClickFinishQuestion = () => {
        setDisplayTest(false)
        setQuestionNo(1)

        saveAudios(recordAudioUrls, answerAudioFilepaths)

        console.log(
            'onClickFinishQuestion; Recorded Audio URLs: ',
            recordAudioUrls,
            'last recorded audio URL: ',
            mediaBlobUrl
        )
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
                <audio controls src={audioUrl} type="audio/mp3">
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
                        <audio controls src={mediaBlobUrl} />
                    )}
                </Box>
                {questionNo < questions.length ? (
                    <Button onClick={onClickNextQuestion}>Next Question</Button>
                ) : (
                    <Button onClick={onClickFinishQuestion}>Finish Test</Button>
                )}
            </Box>
        )
    }

    return <Container>{displayTest ? <Test /> : <TestList />}</Container>
}

export default App
