import type { TeacherInputRequest, AIResponse } from '../types/index';

const API_BASE_URL = 'http://localhost:8000';

export const apiClient = {
    async sendTeacherInput(data: TeacherInputRequest): Promise<AIResponse> {
        const response = await fetch(`${API_BASE_URL}/teacher-input`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'API request failed');
        }

        return response.json();
    },
};
