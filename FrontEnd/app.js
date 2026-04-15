const API = 'http://localhost:3000/api/posts';

const form = document.getElementById('postform');
const tableBody = document.querySelector('#posttable tbody'); 
const postIdInput = document.getElementById('postId');
const errorDiv = document.getElementById('formError');
const submitBtn = document.getElementById('submitbtn');

async function loadPosts() {
    const res = await fetch(API);
    const data = await res.json();
    render(data.items);
}

function render(posts) {
    tableBody.innerHTML = "";

    posts.forEach(post => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.body}</td>
            <td>${post.createdAt}</td>
            <td>${post.author}</td>
            <td>
                <button data-id="${post.id}" class="edit-btn">Ред.</button>
                <button data-id="${post.id}" class="delete-btn">Вид.</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function readForm() {
    return {
        title: title.value.trim(),
        category: category.value,
        body: Body.value.trim(),
        author: Author.value.trim()
    };
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    const data = readForm();
    const id = postIdInput.value;

    try {
        if (id) {
            await fetch(`${API}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        } else {
            await fetch(API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
        }

        form.reset();
        postIdInput.value = "";
        submitBtn.textContent = "Надіслати пост";

        loadPosts();

    } catch (e) {
        errorDiv.textContent = "Помилка запиту";
    }
});

tableBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        loadPosts();
    }

    if (e.target.classList.contains("edit-btn")) {
        const res = await fetch(`${API}/${id}`);
        const post = await res.json();

        title.value = post.title;
        category.value = post.category;
        Body.value = post.body;
        Author.value = post.author;

        postIdInput.value = post.id;
        submitBtn.textContent = "Оновити пост";
    }
});

loadPosts();