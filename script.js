
// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Load saved tasks from localStorage
let tasks = [];

try {
    const savedTasks = localStorage.getItem("todoTasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (Array.isArray(parsedTasks)) {
        tasks = parsedTasks.filter(task =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch (error) {
    console.error("Unable to load saved tasks:", error);
}

// Save tasks
function saveTasks() {
    try {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Unable to save tasks:", error);
        alert("Could not save tasks in this browser.");
    }
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: crypto.randomUUID(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Display tasks
function renderTasks() {
    taskList.replaceChildren();

    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") {
            return task.completed;
        }

        if (filter === "pending") {
            return !task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    // Update task counts
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.length - completedCount;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completedCount;
    pendingTasks.textContent = pendingCount;

    // Show or hide empty message
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";

        if (filter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        } else if (filter === "pending") {
            emptyMessage.textContent = "No pending tasks. Great job!";
        } else {
            emptyMessage.textContent = "No tasks yet. Add your first task!";
        }
    } else {
        emptyMessage.style.display = "none";
    }
}

// Mark a task as completed or pending
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Filter tasks
filterTasks.addEventListener("change", renderTasks);

// Display saved tasks when the page opens
renderTasks();

