let posts = JSON.parse(localStorage.getItem('myPosts')) || [];;
const form = document.getElementById('postform');
const tableBody = document.querySelector('#posttable tbody'); 
const clearBtn = document.getElementById('deletebtn'); 
const errorDiv = document.getElementById('formError');
const postIdInput = document.getElementById('postId');
const submitBtn = document.getElementById('submitbtn');

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
            <td>${post.body}</td> 
            <td>${post.createdAt}</td>
            <td>${post.author}</td> 
            <td>
                <button data-id="${post.id}" class="edit-btn"> Ред.</button>
                <button data-id="${post.id}" class="delete-btn"> Вид.</button>
            </td>`;
        tableBody.appendChild(tr);
    });
}

function addPost(data) {
    const newPost = createPost(data);
    posts.push(newPost);
    saveToLocalStorage();
}

function updatePost(id, data) {
    posts = posts.map(post => post.id === id ? { ...post, ...data } : post);
    saveToLocalStorage();
}

function deletePost(id) {
    if(confirm("Ви впевнені, що хочете видалити цей пост?")) {
        posts = posts.filter(p => p.id !== id);
        saveToLocalStorage();
        render();
    }
}

function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById("title").value = post.title;
    document.getElementById('category').value = post.category;
    document.getElementById('Body').value = post.body;
    document.getElementById('Author').value = post.author;
    postIdInput.value = post.id;

    submitBtn.textContent = "Оновити пост";
    form.scrollIntoView({ behavior: 'smooth' });
}

function clearForm() {
    form.reset();
    postIdInput.value = "";
    errorDiv.textContent = "";
    submitBtn.textContent = "Надіслати пост";
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

    const currentId = postIdInput.value;

    if (currentId) {
        updatePost(Number(currentId), formData);
    } else {
        addPost(formData);
    }

    render();
    clearForm();
});

tableBody.addEventListener("click", function(e) {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains("delete-btn")) {
        deletePost(id);
    }
    
    if (e.target.classList.contains("edit-btn")) {
        editPost(id);
    }
});

clearBtn.addEventListener("click", clearForm);
function saveToLocalStorage() {
    localStorage.setItem('myPosts', JSON.stringify(posts));
}
render();