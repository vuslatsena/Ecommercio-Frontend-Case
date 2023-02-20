const TO_DO_STORE_NAME = "todoStore";

var username;

class TodoStore {
  static instance;

  static getInstance() {
    if (!TodoStore.instance) {
      TodoStore.instance = new TodoStore();
    }
    return TodoStore.instance;
  }

  todoStore;

  constructor() {
    this.todoStore = JSON.parse(localStorage.getItem("todoStore"));

    if (!this.todoStore) {
      this.todoStore = {};
      localStorage.setItem("todoStore", JSON.stringify(this.todoStore));
    }
  }

  getTodosForUser(username) {
    if (!this.todoStore[username]) {
      this.setTodosForUser(username, []);
    }
    return this.todoStore[username];
  }

  setTodosForUser(username, todos) {

    this.todoStore[username] = todos;

    localStorage.setItem("todoStore", JSON.stringify(this.todoStore));

    renderTodoApplication();
  }
}

const application = document.getElementById("todo-application");

window.addEventListener("load", () => {
  username = localStorage.getItem("username");

  if (!username || username.length < 1) {
    alert("Kullanıcı ismi boş olamaz!");
    location.href = "login.html";
    return;
  }

  setInitialToDos(username);
  renderTodoApplication();
});

function renderTodoApplication() {
  let todoList = TodoStore.getInstance().getTodosForUser(username);
  console.log(todoList);

  let uniqueDates = [];

  todoList.map((todoItem) => {

    if (!uniqueDates.includes(todoItem.date)) {
      uniqueDates.push(todoItem.date);
    }
  });

  let uniqueDatesAsDate = [];

  uniqueDates.map((date) => uniqueDatesAsDate.push(new Date(date)));

  uniqueDatesAsDate.sort((o1, o2) =>
  o1.getTime() > o2.getTime() ? 1 : o1.getTime() < o2.getTime() ? -1 : 0
  );

  var applicationRender = "";

  uniqueDatesAsDate.map((date) => {
    let currentListItems = [];
    todoList.map((item) => {
      if (new Date(item.date).getTime() === date.getTime())
        currentListItems.push(item);
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var month = date.getUTCMonth() + 1; //months from 1-12
    var monthName = monthNames[month - 1];
    var day = date.getUTCDate(); //days from 1-31

    const weekDaysName = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    var weekdayNumber = date.getDay();
    var weekdayName = weekDaysName[weekdayNumber];

    var selectedDate = weekdayName + ", " + monthName + " " + day;
    applicationRender +=
      `<div class="list">
    <div class="date-title">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.4 2.4H18V1.2C18 0.88174 17.8736 0.576515 17.6485 0.351472C17.4235 0.126428 17.1183 0 16.8 0C16.4817 0 16.1765 0.126428 15.9515 0.351472C15.7264 0.576515 15.6 0.88174 15.6 1.2V2.4H8.4V1.2C8.4 0.88174 8.27357 0.576515 8.04853 0.351472C7.82348 0.126428 7.51826 0 7.2 0C6.88174 0 6.57652 0.126428 6.35147 0.351472C6.12643 0.576515 6 0.88174 6 1.2V2.4H3.6C2.64522 2.4 1.72955 2.77928 1.05442 3.45442C0.379285 4.12955 0 5.04522 0 6V20.4C0 21.3548 0.379285 22.2705 1.05442 22.9456C1.72955 23.6207 2.64522 24 3.6 24H20.4C21.3548 24 22.2705 23.6207 22.9456 22.9456C23.6207 22.2705 24 21.3548 24 20.4V6C24 5.04522 23.6207 4.12955 22.9456 3.45442C22.2705 2.77928 21.3548 2.4 20.4 2.4ZM21.6 20.4C21.6 20.7183 21.4736 21.0235 21.2485 21.2485C21.0235 21.4736 20.7183 21.6 20.4 21.6H3.6C3.28174 21.6 2.97652 21.4736 2.75147 21.2485C2.52643 21.0235 2.4 20.7183 2.4 20.4V12H21.6V20.4ZM21.6 9.6H2.4V6C2.4 5.68174 2.52643 5.37652 2.75147 5.15147C2.97652 4.92643 3.28174 4.8 3.6 4.8H6V6C6 6.31826 6.12643 6.62348 6.35147 6.84853C6.57652 7.07357 6.88174 7.2 7.2 7.2C7.51826 7.2 7.82348 7.07357 8.04853 6.84853C8.27357 6.62348 8.4 6.31826 8.4 6V4.8H15.6V6C15.6 6.31826 15.7264 6.62348 15.9515 6.84853C16.1765 7.07357 16.4817 7.2 16.8 7.2C17.1183 7.2 17.4235 7.07357 17.6485 6.84853C17.8736 6.62348 18 6.31826 18 6V4.8H20.4C20.7183 4.8 21.0235 4.92643 21.2485 5.15147C21.4736 5.37652 21.6 5.68174 21.6 6V9.6Z"
          fill="#800080"
        />
      </svg>
      <h2>` +
      selectedDate +
      `</h2>
    </div>
    ` +
      renderTodoList(currentListItems) +
      `
  </div>
  
  `;
  });

  application.innerHTML = applicationRender;

  todoList.map((item) => {
    let todoElement = document.getElementById(item.key);
    let todoElementInput = document.getElementById("input-" + item.key);
    let todoElementEdit = document.getElementById("edit-" + item.key);
    let todoElementDelete = document.getElementById("delete-" + item.key);
    let todoElementComplete = document.getElementById(
      "tg-complete-" + item.key
    );
    todoElementEdit.addEventListener("click", (e) => {
      onEditClick(e);
    });
    todoElementDelete.addEventListener("click", (e) => {
      onDeleteClick(e);
    });
    todoElementComplete.addEventListener("click", (e) => {
      e.preventDefault();
      onCompleteClick(e);
    });
  });
}

function renderTodoList(todoItems) {
  let innerHtml = "";
  todoItems.map((item) => (innerHtml += renderTodoListItem(item)));
  return innerHtml;
}

function renderTodoListItem(todoItem) {
  console.log(todoItem);
  let check = todoItem.isComplete ? "checked" : "";
  let checkedClass;

  if (check == "checked") {
    checkedClass = " done";
  } else {
    checkedClass = "";
  }
  return (
    `<div class="todo-item` +
    checkedClass +
    `" id="` +
    todoItem.key +
    `">
  <label class="b-contain">
    <input id="tg-complete-` +
    todoItem.key +
    `" type="checkbox" class="check-item" data-key="` +
    todoItem.key + `" ` + check +
    ` />
  </label>
  <div class="todo-content">
    <input id="input-` +
    todoItem.key +
    `" type="text" value="` +
    todoItem.title +
    `" readonly />
  </div>
  <div class="actions">
    <img id="edit-` +
    todoItem.key +
    `" class="edit" src="../images/edit.png" alt="" data-key="` +
    todoItem.key +
    `"/>

    <img id="delete-` +
    todoItem.key +
    `"class="delete" src="../images/delete.png" alt="" data-key="` +
    todoItem.key +
    `"/>
  </div>
</div>`
  );
}

function onEditClick(event) {
  const key = event.target.dataset.key;
  console.log(key);
  
  const inputField = document.getElementById("input-" + key);
  const todolist = TodoStore.getInstance().getTodosForUser(username);

  // Toggle the readonly attribute on the input field to enable editing and change the edit button to a save button
  const isEditMode = event.target.dataset.editMode === "true";
  const imageSrc = isEditMode ? "http://127.0.0.1:5500/images/edit.png" : "http://127.0.0.1:5500/images/check.png";
  event.target.src = imageSrc;
  event.target.dataset.editMode = !isEditMode;
  inputField.readOnly = !isEditMode;

  // Update the todo list with the new value of the todo item
  const itemToUpdate = todolist.find(item => item.key === key);
  if (itemToUpdate) {
    itemToUpdate.title = inputField.value;
  }

  // Save the new updated todo list to local storage
  TodoStore.getInstance().setTodosForUser(username, todolist);
}

function onDeleteClick(event) {
  let key = event.target.dataset.key;

  let todolist = TodoStore.getInstance().getTodosForUser(username);

  var newList = [];
  todolist.map((item) => {
    if (item.key != key) {
      newList.push(item);
    }
  });

  TodoStore.getInstance().setTodosForUser(username, newList);
}

function onCompleteClick(event) {
  let key = event.target.dataset.key;

  let todolist = TodoStore.getInstance().getTodosForUser(username);

  todolist.forEach((item) => {
    console.log(item.key);
    if (item.key == key) {
      let comp = JSON.parse(item.isComplete);
      item.isComplete = !comp;
    }
  });

  TodoStore.getInstance().setTodosForUser(username, todolist);
}

function setInitialToDos(username) {
  let todoStore = TodoStore.getInstance();
  // get the todo list for the user
  todoStore.getTodosForUser(username);
}

var modal = document.getElementById("simpleModal");
var modalBtn = document.getElementById("add-new-task");
var closeBtn = document.getElementsByClassName("cancelBtn")[0];
var saveBtn = document.getElementById("saveBtn");
var todoForm = document.getElementById("new-todo-form");

modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", clickOutside);
todoForm.addEventListener("submit", saveTask);

function openModal() {
  modal.style.display = "block";
}

function closeModal(event) {
  event.preventDefault();
  modal.style.display = "none";
}

function clickOutside(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function saveTask(event) {
  event.preventDefault();
  modal.style.display = "none";
  var taskName = document.getElementById("content").value;
  var taskDate = document.getElementById("date").value;
  var task = {
    name: taskName,
    date: taskDate,
  };

  let newTodoItem = new TodoItem(taskName, taskDate);

  let userTodo = TodoStore.getInstance().getTodosForUser(username);

  userTodo.push(newTodoItem);

  TodoStore.getInstance().setTodosForUser(username, userTodo);
  console.log(task);
}

class TodoItem {
  constructor(title, date) {
    this.date = date;
    this.title = title;
    this.key = Date.now();
    this.isComplete = false;
  }

  getDate() {
    return this.date;
  }

  hasDate(otherDate) {
    return this.date.getTime() === otherDate.getTime();
  }

  getTitle() {
    return this.title;
  }
}
