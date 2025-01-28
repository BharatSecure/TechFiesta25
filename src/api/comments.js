import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const getComments = async (incidentId) => {
    const response = await axios.get(`${API_URL}/incidents/${incidentId}/comments/`);
    return response.data;
};

export const addComment = async (incidentId, commentData, token) => {
    const response = await axios.post(`${API_URL}/incidents/${incidentId}/comments/`, commentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
