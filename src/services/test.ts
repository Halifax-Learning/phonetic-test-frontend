import axios from 'axios'

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
