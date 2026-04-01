import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const uploadResumeAPI = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/analyze/resume`, formData);
        return response.data;
    } catch (error) {
        console.error("Error uploading resume", error);
        throw error;
    }
};

export const fetchGithubAnalysisAPI = async (username, parsedResume, targetRole) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze/github`, {
            username,
            parsedResume,
            targetRole
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching github analysis", error);
        throw error;
    }
};
