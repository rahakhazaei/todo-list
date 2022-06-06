//variabls
const todoInput = document.querySelector(".todos__input input");
const addTaskBtn = document.querySelector(".add-icon-wrapper");
const todosItems = document.querySelector(".todos-items");
const todosMessage = document.querySelector(".todosItemMessage");
const todosController = document.querySelector(".todos__controller");

//events

addTaskBtn.addEventListener("click", addTask);
todosItems.addEventListener("click", checkEditRemove);
todosController.addEventListener("click", controller);
document.addEventListener("DOMContentLoaded", getLocalTodos);
todoInput.addEventListener("keydown", (e) => {
  const haveClassEdit = e.target.classList.contains("edit");
  if (e.key === "Enter" && !haveClassEdit) {
    addTask();
  }
});

window.onload = () => todoInput.focus();

//functions
function addTask(e) {
  todosMessage.style.display = "none";
  if (todoInput.value.trim().length > 0) {
    createTodoBlock(todoInput.value);
    saveLocalTodos(todoInput.value);
    todoInput.value = "";
  }
}

//create each todo block
function createTodoBlock(todoInput, todoClass, checkedProperty) {
  const numberOfChild = todosItems.children.length;
  const todosItemDiv = document.createElement("div");
  todosItemDiv.classList.add("todos-item", `todo-${numberOfChild}`);
  todosItemDiv.innerHTML = `<label for="input_${numberOfChild}" class="todos-item__task">
  <input type="checkbox" name="" ${checkedProperty} id="input_${numberOfChild}" class="todos-item-check"/>
  <span class="todos-item-text todosItemText todo-${numberOfChild} ${todoClass}" id="todo-${numberOfChild}">${todoInput}</span>
</label>
<i class='icon-edit todo-${numberOfChild} fas fa-pen'></i>
<i class="icon-trash todo-${numberOfChild} fa fa-trash-o"></i>`;
  todosItems.appendChild(todosItemDiv);
}

function checkEditRemove(e) {
  const classList = [...e.target.classList];
  if (classList[0] === "todos-item-check") {
    const sibling = e.target.nextElementSibling;
    sibling.classList.toggle("completed");
    const textStatus = sibling.classList.contains("completed");
    updateLocalTodoStatus(textStatus, sibling.classList[2]);
  } else if (classList[0] === "icon-trash") {
    removeLocalTodos(classList[1]);
    e.target.parentElement.remove();
    const numberOfChild = todosItems.children.length;
    if (numberOfChild === 1) todosMessage.style.display = "block";
  } else if (classList[0] === "icon-edit") {
    document.querySelector('.todosValidateMessage').style.display="none";
    todoInput.classList.add("edit");
    todoInput.focus();
    const textParentClass = e.target.classList;
    const currentText = document.querySelector(
      `.${textParentClass[1]} span`
    ).innerText;
    todoInput.value = currentText;
    searchText = currentText;
    todoInput.addEventListener(
      "change",
      (e) => {
        if (todoInput.value.trim().length > 0) {
          document.querySelector(`.${textParentClass[1]} span`).innerText =
          todoInput.value;
        updateLocalTodo(textParentClass[1], searchText, todoInput.value);
        todoInput.value = "";
        todoInput.classList.remove("edit");
        }
        else {
          document.querySelector('.todosValidateMessage').style.display="block";
        }
        
      },
      { once: true }
    );
  }
}

function controller(e) {
  const allTextItems = document.querySelectorAll(".todosItemText");
  if (e.target.classList.contains("all")) {
    allTextItems.forEach((item) => {
      item.parentElement.parentElement.style.display = "flex";
    });
  } else if (e.target.classList.contains("complete")) {
    allTextItems.forEach((item) => {
      if (item.classList.contains("completed"))
        item.parentElement.parentElement.style.display = "flex";
      else item.parentElement.parentElement.style.display = "none";
    });
  } else if (e.target.classList.contains("uncomplete")) {
    allTextItems.forEach((item) => {
      if (!item.classList.contains("completed"))
        item.parentElement.parentElement.style.display = "flex";
      else item.parentElement.parentElement.style.display = "none";
    });
  } else if (e.target.classList.contains("todosClearAll")) {
    allTextItems.forEach((item) => {
      item.parentElement.parentElement.remove();
    });
    emptyLocalStorage();
    todosMessage.style.display = "block";
  }
}

function saveLocalTodos(todo) {
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  const entry = { text: todo, class: "" };
  savedTodos.push(entry);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function getLocalTodos() {
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];

  if (savedTodos.length > 0) {
    todosMessage.style.display = "none";
  } else {
    todosMessage.style.display = "block";
  }
  savedTodos.forEach((todo) => {
    const checked = todo.class ? "checked" : "";
    createTodoBlock(todo.text, todo.class, checked);
  });
}

function removeLocalTodos(itemClass) {
  const todo = document.querySelector(`.${itemClass} span`);
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];

  const filterTodos = savedTodos.filter((item) => item.text !== todo.innerText);
  localStorage.setItem("todos", JSON.stringify(filterTodos));
}

function emptyLocalStorage() {
  const empty = [];
  localStorage.setItem("todos", JSON.stringify(empty));
}

function updateLocalTodo(itemClass, searchText, newText) {
  const todo = document.querySelector(`.${itemClass} span`);
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
  const filterEqualTodos = savedTodos.filter((item) => {
    return item.text === searchText;
  });

  const filterUnequalTodos = savedTodos.filter((item) => {
    return item.text !== searchText;
  });

  for (let i = 0; i < filterEqualTodos.length; i++) {
    filterEqualTodos[i].text = newText;
  }
  const updateTodos = [...filterEqualTodos, ...filterUnequalTodos];
  localStorage.setItem("todos", JSON.stringify(updateTodos));
}

function updateLocalTodoStatus(status, element) {
  const searchItem = document.querySelector(`#${element}`);
  const searchText = searchItem.textContent;
  let savedTodos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];

  if (status) {
    const equalTodos = savedTodos.filter((item) => {
      return item.text === searchText;
    });

    equalTodos.forEach((item) => {
      item.class = "completed";
    });

    const unequalTodos = savedTodos.filter((item) => item.text !== searchText);

    savedTodos = [...equalTodos, ...unequalTodos];
  } else {
    const equalTodos = savedTodos.filter((item) => {
      return item.text === searchText;
    });

    equalTodos.forEach((item) => {
      item.class = "";
    });

    const unequalTodos = savedTodos.filter((item) => item.text !== searchText);

    savedTodos = [...equalTodos, ...unequalTodos];
  }

  localStorage.setItem("todos", JSON.stringify(savedTodos));
}
