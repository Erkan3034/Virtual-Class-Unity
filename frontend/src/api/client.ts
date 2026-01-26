import type { TeacherInputRequest, AIResponse } from '../types/index';

const API_BASE_URL = 'http://localhost:8000';

export const apiClient = {
    async login(teacher_id: string): Promise<{ token: string }> {
        console.log("Mock login for:", teacher_id);
        const token = "dev-token";
        localStorage.setItem('token', token);
        return { token };
    },

    async sendTeacherAction(data: TeacherInputRequest): Promise<AIResponse> {
        return this.sendTeacherInput(data);
    },

    async sendTeacherInput(data: TeacherInputRequest): Promise<AIResponse> {
        let token = localStorage.getItem('token');
        if (!token) {
            token = "dev-token"; // Fallback for dev
            localStorage.setItem('token', token);
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/teacher/input`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
