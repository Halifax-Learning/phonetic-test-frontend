import axios from 'axios'

const backendUrl = 'http://localhost:8000/api/audio'

/**
 * Get audio file from backend server by filepath
 * @param {string} filepath
 * @returns {any} response.data
 */
const getAudio = async (filepath) => {
    const response = await axios.get(`${backendUrl}/${filepath}`, { responseType: 'blob' })
    const audioUrl = URL.createObjectURL(response.data)
    return audioUrl
}

export { getAudio }
