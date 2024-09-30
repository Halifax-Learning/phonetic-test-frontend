import { createAction } from '@reduxjs/toolkit'
import * as audioService from '../services/audio'

// action creator
export const setAudioBlobUrls = createAction<{
    audioUrls: { [filename: string]: string }
    testIndex: number
}>('setAudioBlobUrls')

// reducer function
export const handleSetAudioBlobUrls = (
    state: any,
    action: {
        payload: {
            audioUrls: { [filename: string]: string }
            testIndex: number
        }
    }
) => {
    const { audioUrls, testIndex } = action.payload

    const assessment = state.assessment ?? state.gradingAssessment ?? null

    if (assessment) {
        const test = assessment.tests[testIndex]
        const numQuestions = test.testQuestions.length

        test.testType.questionType.instructionAudioBlobUrl = audioUrls['instruction.mp3']

        for (let i = 0; i < numQuestions; i++) {
            test.testQuestions[i].question.questionAudioBlobUrl = audioUrls[`question_${i}.mp3`]

            test.testQuestions[i].question.correctAnswerAudioBlobUrl =
                audioUrls[`correct_answer_${i}.mp3`]

            test.testQuestions[i].answerAudioBlobUrl = audioUrls[`answer_${i}.mp3`]
        }

        test.hasFetchedAudio = true
    }
}

// thunk function
export const fetchAudios = (testId: string, testIndex: number, includeAnswer: boolean = false) => {
    return async (dispatch: any) => {
        const audioUrls = await audioService.getAudios(testId, includeAnswer)
        dispatch(
            setAudioBlobUrls({
                audioUrls,
                testIndex,
            })
        )
    }
}

// action creator
export const resetRootState = () => {
    return {
        type: 'RESET_ROOT_STATE',
    }
}
