import { apiUrl } from './apiBase.js';

let csrfToken = null;

export async function getCsrfToken() {
    if (!csrfToken) {
        const response = await fetch(apiUrl('/api/csrf-token'), {
            credentials: 'include' // Include cookies
        });
        const data = await response.json();
        csrfToken = data.csrfToken;
    }
    return csrfToken;
}

export async function loginUser(credentials) {
    return fetch(apiUrl('/api/users/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json());
}

export async function registerUser(userData) {
    return fetch(apiUrl('/api/users/register'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(data => data.json());
}
