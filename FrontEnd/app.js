const form = document.getElementById('postform');
const tableBody = document.querySelector('#posttable tbody');
const postIdInput = document.getElementById('postId');
const errorDiv = document.getElementById('formError');
const submitBtn = document.getElementById('submitbtn');
const statusDiv = document.getElementById('status');

function showStatus(text, type = '') {
    statusDiv.textContent = text;
    statusDiv.className = type ? `status-${type}` : '';
}

function setFormError(msg) {
    errorDiv.textContent = msg;
}

function lockBtn(locked) {
    submitBtn.disabled = locked;
    submitBtn.style.opacity = locked ? '0.6' : '1';
}

function validateForm(data) {
    const errors = [];

    if (!data.title)
        errors.push('Заголовок обовʼязковий');
    else if (data.title.length < 3)
        errors.push('Заголовок — мінімум 3 символи');
    else if (data.title.length > 100)
        errors.push('Заголовок — максимум 100 символів');

    if (!data.category)
        errors.push('Категорія обовʼязкова');

    if (!data.body)
        errors.push('Зміст обовʼязковий');
    else if (data.body.length < 5)
        errors.push('Зміст — мінімум 5 символів');
    else if (data.body.length > 1000)
        errors.push('Зміст — максимум 1000 символів');

    if (!data.author)
        errors.push('Автор обовʼязковий');
    else if (data.author.length < 2)
        errors.push('Автор — мінімум 2 символи');
    else if (data.author.length > 50)
        errors.push('Автор — максимум 50 символів');

    return errors;
}

function readForm() {
    return {
        title:    document.getElementById('title').value.trim(),
        category: document.getElementById('category').value,
        body:     document.getElementById('Body').value.trim(),
        author:   document.getElementById('Author').value.trim()
    };
}

async function loadPosts() {
    showStatus('Завантаження...', 'loading');
    try {
        const data = await apiClient.getList();

        if (!data.items || data.items.length === 0) {
            render([]);
            showStatus('Немає даних', 'empty');
            return;
        }

        render(data.items);
        showStatus('✓ Дані завантажено', 'success'); // <-- ОСЬ ВИПРАВЛЕННЯ

    } catch (err) {
        render([]);
        showStatus(`Помилка завантаження: ${err.message}`, 'error');
        console.error(err);
    }
}

async function loadComments(postId) {
    const container = document.getElementById(`comments-${postId}`);
    if (!container) return;

    try {
        const data = await apiClient.getCommentsByPost(postId);
        container.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            container.innerHTML = '<div>Немає коментарів</div>';
            return;
        }

        data.items.forEach(comment => {
            container.innerHTML += `
                <div class="comment">
                    <b>${comment.author}</b>: ${comment.text}
                </div>
            `;
        });

    } catch (err) {
        container.innerHTML = `<div class="error">Помилка коментарів: ${err.message}</div>`;
        console.error(err);
    }
}

function render(posts) {
    tableBody.innerHTML = '';

    posts.forEach(post => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.body}</td>
            <td>${post.createdAt}</td>
            <td>${post.author}</td>
            <td>
                <button data-id="${post.id}" class="edit-btn">Ред.</button>
                <button data-id="${post.id}" class="delete-btn">Вид.</button>
                <div class="comment-box">
                    <input type="text" id="comment-${post.id}" placeholder="Коментар">
                    <button class="comment-btn" data-id="${post.id}">Додати</button>
                    <div id="comments-${post.id}"></div>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
        loadComments(post.id);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormError('');

    const data = readForm();
    const validationErrors = validateForm(data);

    if (validationErrors.length > 0) {
        setFormError(validationErrors.join(' | '));
        return;
    }

    const id = postIdInput.value;
    lockBtn(true);

    try {
        if (id) {
            await apiClient.update(id, data);
        } else {
            await apiClient.create(data);
        }

        form.reset();
        postIdInput.value = '';
        submitBtn.textContent = 'Надіслати пост';
        await loadPosts();

    } catch (err) {
        const detail = err.errors.length > 0
            ? err.errors.join(' | ')
            : err.message;
        setFormError(`Помилка (${err.status}): ${detail}`);

    } finally {
        lockBtn(false);
    }
});

tableBody.addEventListener('click', async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('delete-btn')) {
        if (!confirm('Видалити запис?')) return;

        e.target.disabled = true;
        try {
            await apiClient.remove(id);
            await loadPosts();
        } catch (err) {
            alert(`Помилка видалення (${err.status}): ${err.message}`);
            e.target.disabled = false;
        }
    }

    if (e.target.classList.contains('edit-btn')) {
        try {
            const post = await apiClient.getById(id);
            document.getElementById('title').value    = post.title;
            document.getElementById('category').value = post.category;
            document.getElementById('Body').value     = post.body;
            document.getElementById('Author').value   = post.author;
            postIdInput.value = post.id;
            submitBtn.textContent = 'Оновити пост';
        } catch (err) {
            alert(`Помилка завантаження запису (${err.status}): ${err.message}`);
        }
    }

    if (e.target.classList.contains('comment-btn')) {
        const postId = e.target.dataset.id;
        const input  = document.getElementById(`comment-${postId}`);
        const text   = input.value.trim();

        if (!text) {
            alert('Введіть текст коментаря');
            return;
        }

        e.target.disabled = true;
        try {
            await apiClient.createComment({ text, author: 'Student', postId });
            input.value = '';
            await loadComments(postId);
        } catch (err) {
            alert(`Помилка коментаря (${err.status}): ${err.message}`);
        } finally {
            e.target.disabled = false;
        }
    }
});

document.getElementById('deletebtn').addEventListener('click', () => {
    form.reset();
    postIdInput.value = '';
    submitBtn.textContent = 'Надіслати пост';
    setFormError('');
});

loadPosts();