import axios from 'axios'
import JSZip from 'jszip'
import axiosInstance from './axiosInstance'

const baseUrl = import.meta.env.VITE_API_URL + '/audio'

/**
 * --- CURRENTLY UNUSED ---
 *
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

export const getAudios = async (testId: string, includeAnswer: boolean = false) => {
    const url = !includeAnswer
        ? `${baseUrl}/${testId}`
        : `${baseUrl}/${testId}?include_answer=${includeAnswer}`

    const response = await axiosInstance.get(url, { responseType: 'blob' })

    const zip = await JSZip.loadAsync(response.data)

    const audioUrls: { [filename: string]: string } = {}
    await Promise.all(
        Object.keys(zip.files).map(async (relativePath) => {
            const zipEntry = zip.files[relativePath]
            const blob = await zipEntry.async('blob')
            const audioUrl = URL.createObjectURL(blob)
            audioUrls[zipEntry.name] = audioUrl
        })
    )

    return audioUrls
}
