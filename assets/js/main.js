const listTask = JSON.parse(localStorage.getItem("dataListTodo"));
let data;
if (listTask == null) {
  data = [
    {
      type: "todo",
      category: "Thêm task",
      title: "Hãy thêm task mới có Todo List",
      content: "Thêm các task cần thực hiện",
      datetime: Date(Date.now().toString()).slice(0, 15),
    },
  ];
} else {
  data = listTask;
}

// render data
const todo = document.getElementById("listTodo");
const doing = document.getElementById("listDoing");
const finished = document.getElementById("listFinished");

function renderData(data) {
  data.forEach((item, index) => {
    if (item.type === "todo") {
      root = todo;
    } else if (item.type === "doing") {
      root = doing;
    } else if (item.type === "finished") {
      root = finished;
    }
    root.innerHTML =
      root.innerHTML +
      `<div class="content__item">
            <div class="item__header">
                <div class="item__heading">
                    <h2 class="item__category">${item.category}</h2>
                    <h1 class="item__title">${item.title}</h1>
                </div>
                <div class="item__button">
                    <i class="fa-solid fa-pen" onclick="EditAt(${index})" id="btnEdit"></i>
                    <i class="fa-solid fa-trash" onclick="RemoveAt(${index})"></i>
                </div>
            </div>
            <div class="item__body">
                <span class="item__content">${item.content}</span>
                <div class="item__datetime">
                    <i class="fa-solid fa-clock"></i>
                    <span class="item__time">${item.datetime}</span>
                </div>
            </div>
        </div>`;
  });
  countTask();
}

// count tasks
const countTodo = document.querySelector("#todo .part__quantity");
const countDoing = document.querySelector("#doing .part__quantity");
const countFinished = document.querySelector("#finished .part__quantity");

function countTask() {
  let count_Todo = 0,
    count_Doing = 0,
    count_Finished = 0;
  data.forEach((item) => {
    if (item.type === "todo") {
      count_Todo += 1;
    } else if (item.type === "doing") {
      count_Doing += 1;
    } else if (item.type === "finished") {
      count_Finished += 1;
    }
  });
  countTodo.innerText = count_Todo.toString();
  countDoing.innerText = count_Doing.toString();
  countFinished.innerText = count_Finished.toString();
}

// add a new task
const addForm = document.getElementById("addForm");

const addCategory = document.getElementById("addCategory");
const addTitle = document.getElementById("addTitle");
const addContent = document.getElementById("addContent");

const btnAddTask = document.getElementById("btnAddTask");
const btnCloseAddForm = document.getElementById("btnCloseAddForm");
const formAddTask = document.querySelector(".form-add-task");

btnAddTask.addEventListener("click", () => {
  formAddTask.classList.remove("none");
});

btnCloseAddForm.addEventListener("click", () => {
  formAddTask.classList.add("none");
});

function insertTask() {
  data.push({
    type: "todo",
    category: addCategory.value,
    title: addTitle.value,
    content: addContent.value,
    datetime: Date(Date.now().toString()).slice(0, 15),
  });
  const typeList = [todo, doing, finished];
  for (i = 0; i < typeList.length; i++) {
    typeList[i].innerHTML = "";
  }
  localStorage.setItem("dataListTodo", JSON.stringify(data));
  renderData(data);
  formAddTask.classList.add("none");
}

// remove task
function RemoveAt(index) {
  data.splice(index, 1);
  const typeList = [todo, doing, finished];
  for (i = 0; i < typeList.length; i++) {
    typeList[i].innerHTML = "";
  }
  localStorage.setItem("dataListTodo", JSON.stringify(data));
  renderData(data);
}

// edit task
const editForm = document.getElementById("editForm");

const editCategory = document.getElementById("editCategory");
const editTitle = document.getElementById("editTitle");
const editContent = document.getElementById("editContent");

const btnCloseEditForm = document.getElementById("btnCloseEditForm");
const formEditTask = document.querySelector(".form-edit-task");
const indexEditForm = document.getElementById("indexEdit");

const todoRadio = document.getElementById("todoRadio");
const doingRadio = document.getElementById("doingRadio");
const finishedRadio = document.getElementById("finishedRadio");

function EditAt(index) {
  formEditTask.classList.remove("none");
  editCategory.value = data[index].category;
  editTitle.value = data[index].title;
  editContent.value = data[index].content;
  if (data[index].type === "todo") {
    todoRadio.checked = true;
  } else if (data[index].type === "doing") {
    doingRadio.checked = true;
  } else if (data[index].type === "finished") {
    finishedRadio.checked = true;
  }
  indexEdit.setAttribute("value", index);

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ind = parseInt(e.target.indexEdit.value);
    data[ind].category = editCategory.value;
    data[ind].title = editTitle.value;
    data[ind].content = editContent.value;
    data[ind].type = document.querySelectorAll(
      "input[name='selected_type']:checked"
    )[0].value;
    data[ind].datetime = Date(Date.now().toString()).slice(0, 15);
    const typeList = [todo, doing, finished];
    for (i = 0; i < typeList.length; i++) {
      typeList[i].innerHTML = "";
    }
    localStorage.setItem("dataListTodo", JSON.stringify(data));
    renderData(data);
    formEditTask.classList.add("none");
  });

  if (btnCloseEditForm) {
    btnCloseEditForm.addEventListener("click", () => {
      formEditTask.classList.add("none");
    });
  }
}

// Validation Form
function Validator(options) {
  var selectorRules = {};

  function getParentElement(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  function validate(inputElement, rule) {
    const parentInputElement = getParentElement(
      inputElement,
      options.formGroupSelector
    );
    const errorElement = parentInputElement.querySelector(
      options.errorSelector
    );
    const rules = selectorRules[rule.selector];
    var errorMessage;

    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
    } else {
      errorElement.innerText = "";
    }
    return !errorMessage;
  }

  const formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;
      options.rules.forEach(function (rule) {
        const inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        insertTask();
      }
    };
  }

  options.rules.forEach(function (rule) {
    if (Array.isArray(selectorRules[rule.selector])) {
      selectorRules[rule.selector].push(rule.message);
    } else {
      selectorRules[rule.selector] = [rule.message];
    }

    var inputElements = formElement.querySelectorAll(rule.selector);
    Array.from(inputElements).forEach(function (inputElement) {
      inputElement.onblur = function () {
        validate(inputElement, rule);
      };

      inputElement.oninput = function () {
        var parentInputElement = getParentElement(
          inputElement,
          options.formGroupSelector
        );
        var errorElement = parentInputElement.querySelector(
          options.errorSelector
        );
        errorElement.innerText = "";
      };
    });
  });
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    message: function (value) {
      return value ? undefined : message;
    },
  };
};

window.onload = () => {
  renderData(data);
};
