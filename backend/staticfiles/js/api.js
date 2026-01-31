const API_BASE = '/api/';

async function request(endpoint, method = 'GET', data = null) {
    let url;
    if (endpoint.includes('?')) {
        const [path, query] = endpoint.split('?');
        url = `${API_BASE}${path}/?${query}`;
    } else {
        url = `${API_BASE}${endpoint}/`;
    }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (response.status === 204) {
            return null;
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(JSON.stringify(errorData) || 'API Request Failed');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export const api = {
    fetchEmployees: (search = '') => request(`employees?search=${encodeURIComponent(search)}`),
    createEmployee: (data) => request('employees', 'POST', data),
    deleteEmployee: (id) => request(`employees/${id}`, 'DELETE'),

    fetchAttendance: (search = '') => request(`attendance?search=${encodeURIComponent(search)}`),
    markAttendance: (data) => request('attendance', 'POST', data),
    updateAttendance: (id, data) => request(`attendance/${id}`, 'PUT', data),
};
