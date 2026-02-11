let posts = [];
const form = document.getElementById('postform');
const tableBody = document.querySelector('#posttable tbody'); 
const clearBtn = document.getElementById('deletebtn'); 
const errorDiv = document.getElementById('formError');

function readForm() { 
    return { 
        title: document.getElementById("title").value.trim(),
        category: document.getElementById('category').value,
        body: document.getElementById('Body').value.trim(),
        author: document.getElementById('Author').value.trim()
    };
}

function validate(data) { 
    if (!data.title) return "Введіть заголовок";
    if (!data.category) return "Оберіть категорію";
    if (!data.body) return "Введіть текст"; 
    if (!data.author) return "Введіть автора"; 
    return null;
}

function createPost(data) { 
    return { 
        id: Date.now(), 
        ...data, 
        createdAt: new Date().toLocaleString() 
    };
}

function render() {
    tableBody.innerHTML = "";
    posts.forEach(post => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.body}</td> <td>${post.createdAt}</td>
            <td>${post.author}</td> <td>
                <button data-id="${post.id}" class="delete-btn">Видалити</button>
            </td>`;
        tableBody.appendChild(tr);
    });
}

function addPost(data) {
    const newPost = createPost(data);
    posts.push(newPost);
}

function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    render();
}

function clearForm() {
    form.reset();
    errorDiv.textContent = "";
}

form.addEventListener("submit", function(e) {
    e.preventDefault();
    errorDiv.textContent = "";

    const formData = readForm();
    const error = validate(formData);

    if (error) {
        errorDiv.textContent = error;
        return;
    }

    addPost(formData);
    render();
    clearForm();
});

tableBody.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        deletePost(id);
    }
});

clearBtn.addEventListener("click", clearForm);
