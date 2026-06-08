const API_BASE_URL = 'http://localhost:3000/api/v1';

let authToken = null;

export function setToken(token) {
    authToken = token;
}

export function getToken() {
    return authToken;
}

export function clearToken() {
    authToken = null;
}

async function request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = { method, headers };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    if (res.status === 204) return null;

    const data = await res.json();

    if (!res.ok) {
        const err = new Error(data.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.code   = data.code   || res.status;
        err.errors = data.errors || [];
        throw err;
    }

    return data;
}

const apiClient = {
    register: (data)         => request('POST', '/auth/register', data),
    login:    (data)         => request('POST', '/auth/login', data),
    logout:   ()             => request('POST', '/auth/logout'),

    getList:  ()             => request('GET',    '/posts'),
    getById:  (id)           => request('GET',    `/posts/${id}`),
    create:   (data)         => request('POST',   '/posts', data),
    update:   (id, data)     => request('PUT',    `/posts/${id}`, data),
    remove:   (id)           => request('DELETE', `/posts/${id}`),

    getCommentsByPost: (postId) => request('GET',  `/comments/post/${postId}`),
    createComment:     (data)   => request('POST', '/comments', data),
};

window.apiClient = apiClient;