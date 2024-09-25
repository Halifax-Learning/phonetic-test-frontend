import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL + '/audio'

/**
 * Fetches the audio file from the server and returns the URL
 *
 * Possible parameter combinations:
 *   - audio_type=instruction & id={question_type_id}
 *   - audio_type=question & id={question_id}
 *   - audio_type=correct_answer & id={question_id}
 *   - audio_type=answer & id={test_question_id}
 */
export const getAudio = async (audio_type: string, id: number | string) => {
    const url = `${baseUrl}?audio_type=${audio_type}&id=${id}`

    const response = await axios.get(url, { responseType: 'blob' })
    const audioUrl = URL.createObjectURL(response.data)
    return audioUrl
}
