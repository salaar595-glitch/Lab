const form = document.getElementById('postform');
const tableBody = document.querySelector('#posttable tbody');
const postIdInput = document.getElementById('postId');
const errorDiv = document.getElementById('formError');
const submitBtn = document.getElementById('submitbtn');
const statusDiv = document.getElementById('status');

function escapeHtml(str) {
    const el = document.createElement('div');
    el.textContent = String(str ?? '');
    return el.innerHTML;
}

function setText(el, value) {
    el.textContent = String(value ?? '');
}

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
    if (!data.title) errors.push('Заголовок обовʼязковий');
    else if (data.title.length < 3) errors.push('Заголовок — мінімум 3 символи');
    else if (data.title.length > 100) errors.push('Заголовок — максимум 100 символів');

    if (!data.category) errors.push('Категорія обовʼязкова');

    if (!data.body) errors.push('Зміст обовʼязковий');
    else if (data.body.length < 5) errors.push('Зміст — мінімум 5 символів');
    else if (data.body.length > 1000) errors.push('Зміст — максимум 1000 символів');

    if (!data.author) errors.push('Автор обовʼязковий');
    else if (data.author.length < 2) errors.push('Автор — мінімум 2 символи');
    else if (data.author.length > 50) errors.push('Автор — максимум 50 символів');

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
        showStatus('✓ Дані завантажено', 'success');
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
            container.textContent = 'Немає коментарів';
            return;
        }

        data.items.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment';

            const bold = document.createElement('b');
            bold.textContent = comment.author;

            div.appendChild(bold);
            div.appendChild(document.createTextNode(': ' + comment.text));
            container.appendChild(div);
        });

    } catch (err) {
        const errDiv = document.createElement('div');
        errDiv.className = 'error';
        errDiv.textContent = `Помилка коментарів: ${err.message}`;
        container.innerHTML = '';
        container.appendChild(errDiv);
        console.error(err);
    }
}

function render(posts) {
    tableBody.innerHTML = '';

    posts.forEach(post => {
        const tr = document.createElement('tr');

        const cells = [post.title, post.category, post.body, post.createdAt, post.author];
        cells.forEach(val => {
            const td = document.createElement('td');
            td.textContent = val ?? '';
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.dataset.id = post.id;
        editBtn.textContent = 'Ред.';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.dataset.id = post.id;
        deleteBtn.textContent = 'Вид.';

        const commentBox = document.createElement('div');
        commentBox.className = 'comment-box';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.id = `comment-${post.id}`;
        commentInput.placeholder = 'Коментар';

        const commentBtn = document.createElement('button');
        commentBtn.className = 'comment-btn';
        commentBtn.dataset.id = post.id;
        commentBtn.textContent = 'Додати';

        const commentsDiv = document.createElement('div');
        commentsDiv.id = `comments-${post.id}`;

        commentBox.appendChild(commentInput);
        commentBox.appendChild(commentBtn);
        commentBox.appendChild(commentsDiv);

        actionTd.appendChild(editBtn);
        actionTd.appendChild(deleteBtn);
        actionTd.appendChild(commentBox);
        tr.appendChild(actionTd);

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
        const detail = err.errors && err.errors.length > 0
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
        if (!text) { alert('Введіть текст коментаря'); return; }
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