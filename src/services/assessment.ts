import axios from 'axios'

const baseUrl = 'http://localhost:8000/api'

export const getAssessmentTypes = async () => {
    const response = await axios.get(`${baseUrl}/assessment_types`)
    return response.data
}

export const getAllAssessments = async () => {
    const response = await axios.get(`${baseUrl}/assessments`)
    return response.data
}

export const getAssessment = async (assessmentId: string) => {
    const response = await axios.get(`${baseUrl}/assessments/${assessmentId}`)
    return response.data
}

export const createAssessment = async (assessmentTypeId: number, testTakerId: string) => {
    const response = await axios.post(`${baseUrl}/assessments`, {
        assessment_type_id: assessmentTypeId,
        test_taker_id: testTakerId,
    })
    return response.data
}
