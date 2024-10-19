import axios from 'axios'
import { convertKeysToSnakeCase } from '../utils/helper'
import axiosInstance from './axiosInstance'

const baseUrl = import.meta.env.VITE_API_URL

export const updateTestQuestion = async (
    testQuestionId: string,
    answerText: string,
    answerAudioBlobUrl: string
) => {
    const url = `${baseUrl}/test_questions/${testQuestionId}`

    // Create a FormData object to send the answer text and audio blob
    const formData = new FormData()
    if (answerText) {
        formData.append('answer_text', answerText)
    }

    // Fetch the answer audio blob and append it to the FormData object
    if (answerAudioBlobUrl) {
        const res = await axios.get(answerAudioBlobUrl, { responseType: 'blob' })
        formData.append('answer_audio', res.data)
    }

    const response = await axiosInstance.put(url, formData)

    return response.data
}

interface TeacherGradingsHttpRequestData {
    teacherAccountId: string
    testQuestions: { testQuestionId: string; teacherEvaluation: boolean; teacherComment: string }[]
}

export const createTeacherGradings = async (data: TeacherGradingsHttpRequestData) => {
    const url = `${baseUrl}/teacher_grading_history`
    const bodySnakeCase = convertKeysToSnakeCase(data)

    const response = await axiosInstance.post(url, bodySnakeCase)

    return response.data
}
