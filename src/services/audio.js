import axios from 'axios'

const backendUrl = 'http://localhost:8000/api/audio/'

/**
 * Get audio file from backend server by filepath
 * @param {string} relativeAudioFilepath - the filepath of the audio file in the file system in the backend server
 * @returns {any} response.data
 */
const getAudio = async (relativeAudioFilepath) => {
    const response = await axios.get(`${backendUrl}${relativeAudioFilepath}`, { responseType: 'blob' })
    const audioUrl = URL.createObjectURL(response.data)
    return audioUrl
}

/**
 * Save audio files to backend server
 *
 * The request body will be like this:
 * {
 *    "answer_0": Blob,
 *    "answer_1": Blob,
 *    "answer_2": Blob,
 *    ...,
 *    "relative_answer_filepaths": '["tests/2024-09-03/<test_id>/answer_<test_question_id>.mp3",  ...]'
 * }
 *
 * @param {Object<string, string>} audioUrls - the list of objects like this: { 'answer_0': audio_url1, 'answer_1': audio_url2, ... }
 * @param {string[]} relativeAudioFilepaths - the relative filepaths in the file system in the backend server to save the audio files
 * @returns {any} response
 */
const saveAudios = async (audioUrls, relativeAudioFilepaths) => {
    const formData = new FormData()

    // Convert each audio URL to a Blob and append it to the FormData object with its corresponding key
    await Promise.all(
        Object.entries(audioUrls).map(async ([key, audioUrl]) => {
            if (!audioUrl) {
                formData.append(key, null)
            } else {
                const response = await axios.get(audioUrl, { responseType: 'blob' })
                formData.append(key, response.data)
            }
        })
    )
    // Serialize the list of filepaths into a JSON string
    const filepathsJson = JSON.stringify(relativeAudioFilepaths)

    // Append the JSON string of filepaths to the FormData object
    formData.append('relative_audio_filepaths', filepathsJson)

    // Send the FormData object in a POST request to the backend server
    const response = await axios.post(backendUrl, formData)
    return response
}

export { getAudio, saveAudios }
