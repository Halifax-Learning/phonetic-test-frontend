import axios from 'axios'

import { TestQuestion } from '../models/interface'

const baseUrl = 'http://localhost:8000/api'

export const getTestTypes = async () => {
    const response = await axios.get(`${baseUrl}/test_types`)
    return response.data
}

export const createTest = async (testTypeId: number, testTakerId: string) => {
    const response = await axios.post(`${baseUrl}/tests`, {
        test_type_id: testTypeId,
        test_taker_id: testTakerId,
    })
    return response.data
}

export const submitTest = async (testId: string, testQuestions: TestQuestion[]) => {
    const url = `${baseUrl}/tests/${testId}`

    const updatedTestQuestions = await Promise.all(
        testQuestions.map(async (testQuestion) => {
            const { answerAudioBlobUrl, ...rest } = testQuestion

            let answerAudioB64Encode = ''
            if (answerAudioBlobUrl) {
                answerAudioB64Encode = await fetchAndEncodeAudioBlob(answerAudioBlobUrl)
            }

            return {
                test_question_id: rest.testQuestionId,
                answer_text: rest.answerText,
                answer_audio_b64_encode: answerAudioB64Encode,
            }
        })
    )

    const response = await axios.put(url, { test_questions: updatedTestQuestions })

    return response.data
}

/**
 * Fetches an audio blob from the given URL and encodes it to base64.
 */
const fetchAndEncodeAudioBlob = async (answerAudioBlobUrl: string): Promise<string> => {
    try {
        const response = await axios.get(answerAudioBlobUrl, { responseType: 'blob' })
        const answerAudioBlob = response.data

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64data = reader.result as string
                resolve(base64data.split(',')[1]) // Extract base64 string from data URL
            }
            reader.onerror = reject
            reader.readAsDataURL(answerAudioBlob)
        })
    } catch (error) {
        console.error('Error fetching or encoding audio blob:', error)
        throw error
    }
}
