const API_BASE_URL = 'http://localhost:3000/api/v1';

async function request(method, path, body) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE_URL}${path}`, options);

    if (res.status === 204) return null;

    const data = await res.json();

    if (!res.ok) {
        const message = data.detail || data.title || `HTTP ${res.status}`;
        const err = new Error(message);
        err.status = res.status;
        err.code   = data.code || res.status;
        err.errors = data.errors || [];
        throw err;
    }

    return data;
}

const apiClient = {
    getList:   ()         => request('GET',    '/posts'),
    getById:   (id)       => request('GET',    `/posts/${id}`),
    create:    (data)     => request('POST',   '/posts', data),
    update:    (id, data) => request('PUT',    `/posts/${id}`, data),
    remove:    (id)       => request('DELETE', `/posts/${id}`),

    getCommentsByPost: (postId) => request('GET',  `/comments/post/${postId}`),
    createComment:     (data)   => request('POST', '/comments', data),
};