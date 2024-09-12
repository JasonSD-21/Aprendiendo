const fs = require("fs");
const path = require("path");

// JSON file to store tasks
const TASK_FILE = path.join(__dirname, "tasks.json");

// Function to load tasks from the JSON file
function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) {
    fs.writeFileSync(TASK_FILE, "[]");
  }
  const data = fs.readFileSync(TASK_FILE);
  return JSON.parse(data);
}

// Function to save tasks to the JSON file
function saveTasks(tasks) {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

// Add a new task
function addTask(description) {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length + 1,
    description: description,
    status: "not done",
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added: ${newTask.description}`);
}

// Update an existing task
function updateTask(taskId, description, status) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    if (description) task.description = description;
    if (["not done", "in progress", "done"].includes(status))
      task.status = status;
    saveTasks(tasks);
    console.log(`Task updated: ${task.description}`);
  } else {
    console.log(`Task with ID ${taskId} not found.`);
  }
}

// Delete a task
function deleteTask(taskId) {
  let tasks = loadTasks();
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(tasks);
  console.log(`Task with ID ${taskId} deleted.`);
}

// List tasks based on status
function listTasks(status) {
  const tasks = loadTasks();
  tasks.forEach((task) => {
    if (!status || task.status === status) {
      console.log(
        `ID: ${task.id}, Description: ${task.description}, Status: ${task.status}`
      );
    }
  });
}

// Parse command line arguments and execute the corresponding function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "add":
      const description = args.slice(1).join(" ");
      if (!description) {
        console.log("Please provide a task description.");
        return;
      }
      addTask(description);
      break;

    case "update":
      const taskId = parseInt(args[1]);
      const updatedDescription = args[2];
      const updatedStatus = args[3];
      if (isNaN(taskId)) {
        console.log("Please provide a valid task ID.");
        return;
      }
      updateTask(taskId, updatedDescription, updatedStatus);
      break;

    case "delete":
      const deleteTaskId = parseInt(args[1]);
      if (isNaN(deleteTaskId)) {
        console.log("Please provide a valid task ID.");
        return;
      }
      deleteTask(deleteTaskId);
      break;

    case "list":
      const status = args[1];
      if (status && !["done", "not done", "in progress"].includes(status)) {
        console.log("Status can only be 'done', 'not done', or 'in progress'.");
        return;
      }
      listTasks(status);
      break;

    default:
      console.log("Usage:");
      console.log("  node task_tracker.js add <description> - Add a new task");
      console.log(
        "  node task_tracker.js update <id> [description] [status] - Update a task"
      );
      console.log("  node task_tracker.js delete <id> - Delete a task");
      console.log(
        '  node task_tracker.js list [status] - List tasks (status can be "done", "not done", or "in progress")'
      );
  }
}

main();
