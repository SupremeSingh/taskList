// Get Username 
let name = "Enter Task";

firebase.auth().onAuthStateChanged((user) => {
  window.name = user.email.split("@")[0];
})

let database = firebase.database();

// Links
let task_name = document.getElementById("task");
let task_date = document.getElementById("deadline");
let add_button = document.getElementById("add_button");
let table_body = document.getElementById("table_body");
let user = document.getElementById("User_Name");

// Counters
let num_tasks = 0;

// Classes
class Task {
  constructor(id, title, deadline) {
    this.id = id;
    this.title = title;
    this.deadline = deadline;
  }
}

class TaskList {
  constructor() {
    this.tasks = [];
  }

  addTask(number, title, deadline) {
    // Add to the list
    let newTask = new Task(number, title, deadline);
    this.tasks.push(newTask);

    // Add to Webpage
    let table_row = document.createElement("tr");
    let row_id = "Task_" + newTask.id;
    table_row.id = row_id;

    table_row.innerHTML = `
            <td style="font-size: x-large; text-align: center;">${newTask.id}</td>
            <td id="task_title" style="font-size: x-large; text-align: center;">${newTask.title}</td>
            <td style="font-size: x-large; text-align: center;">${newTask.deadline}</td>
            <td style="text-align: center;" class="button_choice">
                <button type="button" class="btn btn-success xx${newTask.id}">
                    <i class="fas fa-check xx${newTask.id}"></i>
                </button>
                <button type="button" class="btn btn-warning xx${newTask.id}">
                    <i class="fas fa-edit xx${newTask.id}"></i>
                </button>
                <button type="button" class="btn btn-danger xx${newTask.id}">
                    <i class="fas fa-trash-alt xx${newTask.id}"></i>
                </button>
            </td>
            `;

    table_row.addEventListener("click", button_press);
    table_body.appendChild(table_row);
    task_name.value = "";

    // Add to Firebase
    database.ref("/tasks/" + newTask.id).set({
      title: title,
      deadline: deadline,
    });
  }

  check_task(taskId) {
    let row_id = "Task_" + taskId;
    let row_item = document.getElementById(row_id);

    if (row_item.getAttribute("style") == "background-color: green;") {
      row_item.removeAttribute("style");
    } else {
      row_item.setAttribute("style", "background-color: green;");
    }
  }

  removeTask(taskId) {
    confirm("Are you sure you want to remove this item?");

    // Remove from List
    this.tasks.splice(taskId, 1);

    // Remove from Website
    let row_id = "Task_" + taskId;
    document.getElementById(row_id).remove();

    // Remove from Firebase
    database.ref("/tasks/" + taskId).remove();
  }

  editTask(taskId) {
    let row_id = "Task_" + taskId;
    let query = "#" + row_id + " #task_title";
    let row_text = document.querySelector(query).innerText;

    task_name.value = row_text;
    task_directory.removeTask(taskId);
  }
}

// More Constants
let task_directory = new TaskList();

// More Links

let edit_button = document.getElementsByClassName("btn btn-warning");
let check_button = document.getElementsByClassName("btn btn-success");
let delete_button = document.getElementsByClassName("btn btn-danger");

// Add Listeners
user.innerText = window.name;

add_button.addEventListener("click", (e) => {
  e.preventDefault();

  task_directory.addTask(num_tasks, task_name.value, task_date.value);

  num_tasks += 1;
});

// Helper Methods
function button_press(e) {
  e.preventDefault();
  let row_info = e.target.getAttribute("class").split("xx");

  let class_name = row_info[0].slice(0, -1);
  let item_id = parseInt(row_info[1]);

  // If Check
  if ((class_name == "btn btn-success") | (class_name == "fas fa-check")) {
    task_directory.check_task(item_id);
  }

  // If Edit
  if ((class_name == "btn btn-warning") | (class_name == "fas fa-edit")) {
    task_directory.editTask(item_id);
  }

  // If Delete
  if ((class_name == "btn btn-danger") | (class_name == "fas fa-trash-alt")) {
    task_directory.removeTask(item_id);
  }
}
