import axios from 'axios'

const baseUrl = 'http://localhost:8000/api/test_questions'

export const updateTestQuestion = async (
    testQuestionId: string,
    answerText: string,
    answerAudioBlobUrl: string
) => {
    const url = `${baseUrl}/${testQuestionId}`

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

    const response = await axios.put(url, formData)

    return response.data
}
