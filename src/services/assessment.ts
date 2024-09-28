import axiosInstance from './axiosInstance'

const baseUrl = import.meta.env.VITE_API_URL

export const getAssessmentTypes = async () => {
    const response = await axiosInstance.get(`${baseUrl}/assessment_types`)
    return response.data
}

export const getAllAssessments = async () => {
    const response = await axiosInstance.get(`${baseUrl}/assessments`)
    return response.data
}

export const getAssessment = async (assessmentId: string) => {
    const response = await axiosInstance.get(`${baseUrl}/assessments/${assessmentId}`)
    return response.data
}

export const getInProgressAssessment = async () => {
    const response = await axiosInstance.get(`${baseUrl}/in_progress_assessment`)
    return response.data
}

export const createAssessment = async (assessmentTypeId: number) => {
    const response = await axiosInstance.post(`${baseUrl}/assessments`, {
        assessment_type_id: assessmentTypeId,
    })
    return response.data
}
