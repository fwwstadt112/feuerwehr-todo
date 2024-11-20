const apiUrl = 'http://localhost:5000/todos';

// QR Code generieren
new QRCode(document.getElementById("qrcode"), "https://deine-url.com");

// Aufgaben laden
async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);
        li.innerHTML = `
            ${task.task}
            <div>
                <button class="complete" onclick="toggleComplete('${task._id}')">✔️</button>
                <button onclick="deleteTask('${task._id}')">❌</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Aufgabe hinzufügen
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value;
    if (!task) return;
    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
    });
    taskInput.value = '';
    loadTasks();
}

// Aufgabe als erledigt markieren
async function toggleComplete(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
    });
    loadTasks();
}

// Aufgabe löschen
async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
    loadTasks
