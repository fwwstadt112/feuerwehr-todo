const API_URL = "https://<Vercel-Backend-URL>/api/tasks";

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    const form = document.getElementById("task-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = document.getElementById("task-input");
        const task = { text: input.value, done: false };
        input.value = "";

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        loadTasks();
    });
});

async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        const doneButton = document.createElement("button");
        doneButton.textContent = "✓";
        doneButton.className = "done";
        doneButton.addEventListener("click", async () => {
            await fetch(`${API_URL}/${task._id}`, { method: "PUT" });
            loadTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.addEventListener("click", async () => {
            await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
            loadTasks();
        });

        li.append(doneButton, deleteButton);
        taskList.append(li);
    });
}
