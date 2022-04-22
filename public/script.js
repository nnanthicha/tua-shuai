import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEdbPO3YXkfcz29LiJPssZ7sLaxC8a57c",
  authDomain: "tua-shuai-33f59.firebaseapp.com",
  projectId: "tua-shuai-33f59",
  storageBucket: "tua-shuai-33f59.appspot.com",
  messagingSenderId: "380237340821",
  appId: "1:380237340821:web:b6bb76fe2ea6f9314dbb9c",
};

const app = initializeApp(firebaseConfig);

import {
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const db = getFirestore();
const subjectRef = collection(db, "subjects");
const todoRef = collection(db, "todos");

let currentUser;
let subjectList = [];
let currentFilter = "";
const editScheduleModal = document.getElementById("edit-schedule");
const loginWarningModal = document.getElementById("login-warning");
const addAssignmentModal = document.getElementById("add-assignment");
const todoDetailsModal = document.getElementById("todo-modal");

document.getElementById("username-form").addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();
      let uid = document.getElementById("username").value;
      if (uid) {
        const user = await getDoc(doc(db, "users", uid));
        if (!user) {
          await setDoc(doc(db, "users", uid), {uid});
          console.log("create user");
        }
        currentUser = uid;
        console.log("login as " + currentUser);
        alert("Login success");
        redrawLoginForm(true);
      } else {
        currentUser = null;
        subjectList = [];
        alert("Login failed. Invalid ID or username");
      }
      await redrawSubjectList();
      await drawSchedule();
      await drawTodo();
      await getSubjectList();
    },
    false
);

function redrawLoginForm(isLogin) {
  if (isLogin) {
    document.getElementById("user-login-info").style.display = "flex";
    document.getElementById("user-login").innerHTML = currentUser;
    document.getElementById("username-form").style.display = "none";
  } else {
    document.getElementById("user-login-info").style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("username-form").style.display = "flex";
  }
}

window.logout = logout;

function logout() {
  currentUser = null;
  subjectList = [];
  drawSchedule().then(null);
  drawTodo().then(null);
  createSubjectOpt();
  redrawLoginForm(false);
  console.log("logout");
}

document.getElementById("edit-schedule-button").onclick = function () {
  if (currentUser) {
    editScheduleModal.style.display = "block";
  } else {
    loginWarningModal.style.display = "block";
  }
};

document.getElementById("close-schedule-modal-button").onclick = function () {
  editScheduleModal.style.display = "none";
  getSubjectList().then(null);
};

document.getElementById("add-assignment-button").onclick = function () {
  if (currentUser) {
    addAssignmentModal.style.display = "block";
    createSubjectOpt();
  } else {
    loginWarningModal.style.display = "block";
  }
};

document.getElementById("close-assignment-modal").onclick = function () {
  addAssignmentModal.style.display = "none";
};

document.getElementById("close-todo-modal").onclick = function () {
  todoDetailsModal.style.display = "none";
}

document.getElementById("close-warning-button").onclick = function () {
  loginWarningModal.style.display = "none";
}

document.getElementById("filter").onclick = function () {
  if (!currentUser) {
    loginWarningModal.style.display = "block";
  }
}

window.onclick = function (event) {
  if (event.target === editScheduleModal) {
    editScheduleModal.style.display = "none";
    getSubjectList().then(() => {
      console.log("success")
    });
  } else if (event.target === loginWarningModal) {
    loginWarningModal.style.display = "none";
  } else if (event.target === addAssignmentModal) {
    addAssignmentModal.style.display = "none";
  } else if (event.target === todoDetailsModal) {
    todoDetailsModal.style.display = "none";
  }
};

document
    .getElementById("subject-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      let uid = currentUser;
      let subject = document.getElementById("subject").value;
      let day = document.getElementById("day").value;
      let startTime = document.getElementById("starting-time").value;
      let endTime = document.getElementById("ending-time").value;
      await addDoc(subjectRef, {
        uid,
        subject,
        day,
        startTime,
        endTime,
      });
      redrawSubjectList().then(null);
      drawSchedule().then(null);
    });

async function redrawSubjectList() {
  const subjectList = document.getElementById("subject-list");
  subjectList.innerHTML = "";
  const q = await getDocs(query(subjectRef, where("uid", "==", currentUser)));
  q.forEach((sub) => {
    subjectList.innerHTML += `
    <tr id="${sub.id}">
      <td style="border-right: 1px solid #d0d7de">${sub.data().subject}</td>
      <td style="border-right: 1px solid #d0d7de">${sub.data().day}</td>
      <td>${sub.data().startTime} - ${sub.data().endTime}</td>
      <td><button class="remove" id="remove-subject" onclick="deleteSubject('${
        sub.id
    }')"><img src="assets/images/trash.png" style="width: 20px; height: 20px;" alt="trash"></button></td>
    </tr>`;
  });
  document.getElementById("subject").value = "";
  document.getElementById("day").value = "";
  document.getElementById("starting-time").value = "";
  document.getElementById("ending-time").value = "";
}

window.deleteSubject = async (subId) => {
  const docRef = doc(db, "subjects/" + subId);
  await deleteDoc(docRef);
  await redrawSubjectList();
  await drawSchedule();
};

async function drawSchedule() {
  const d = new Date();
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let today = days[d.getDay()];
  let tomorrow = days[(d.getDay() + 1) % 7];
  const q = await getDocs(query(subjectRef, where("uid", "==", currentUser)));
  if (!q.empty) {
    document.getElementById("schedule-inform").style.display = "none";
    document.getElementById("schedule").style.visibility = "visible";
    document.getElementsByClassName("table")[0].style.overflowX = "auto";
  } else {
    document.getElementById("schedule-inform").style.display = "block";
    document.getElementById("schedule").style.visibility = "hidden";
    document.getElementsByClassName("table")[0].style.overflowX = "hidden";
  }
  const todaySubList = document.getElementById("today-subject");
  await drawDaySchedule(today, todaySubList);
  const tmrSubList = document.getElementById("tomorrow-subject");
  await drawDaySchedule(tomorrow, tmrSubList);
}

async function drawDaySchedule(day, subList) {
  const subs = await getDocs(
      query(
          subjectRef,
          where("uid", "==", currentUser),
          where("day", "==", day),
          orderBy("startTime")
      )
  );
  subList.innerHTML = "";
  if (subs.empty) {
    subList.innerHTML = `<p style="color: gray; text-align: center;"> - - - - Relax!!! - - - -</p>`;
  } else {
    subs.forEach((sub) => {
      subList.innerHTML += `
      <p style="margin-bottom:5px; float: left;">${sub.data().startTime} - ${sub.data().endTime}&nbsp;&nbsp;</p>
      <p style="margin: 0 auto; width: 200px;">${sub.data().subject}</p>
      <div style="clear: both;"></div>
      `;
    });
  }
}

document.getElementById("add-todo-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  let uid = currentUser;
  let title = document.getElementById("title").value;
  let subject = document.getElementById("todo-subject").value;
  let due = document.getElementById("due-date").value;
  let description = document.getElementById("todo-description").value;
  let done = false;
  await addDoc(todoRef, {
    uid,
    title,
    subject,
    due,
    description,
    done,
  });
  addAssignmentModal.style.display = "none";
  document.getElementById("filter").value = currentFilter;
  filterTodo();
});

async function drawTodo(field, filter) {
  let q;
  if (field) {
    q = await getDocs(query(todoRef, where("uid", "==", currentUser), where(field, "==", filter), orderBy("due")));
  } else {
    q = await getDocs(query(todoRef, where("uid", "==", currentUser), orderBy("due")));
  }
  if (!q.empty) {
    document.getElementById("todo-inform").style.display = "none";
    document.getElementById("todo").style.visibility = "visible";
    document.getElementsByClassName("table")[1].style.overflowX = "auto";
  } else {
    document.getElementById("todo-inform").style.display = "block";
    document.getElementById("todo").style.visibility = "hidden";
    document.getElementsByClassName("table")[1].style.overflowX = "hidden";
  }
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  q.forEach((task) => {
    todoList.innerHTML += `
    <tr id="${task.id}" style="border-bottom: 1px solid #d0d7de">
      <td><button id="button-${task.id}" class="mark-done-button" onclick="markDone('${task.id}')"></button></td>
      <td style="text-align: center">${task.data().due}</td>
      <td><p class="title-text" onclick="seeDetail('${task.id}')">${task.data().title}</p></td>
      <td>${task.data().subject}</td>
      <td id="remove-button-${task.id}" style="text-align: right"></td>
    </tr>`;
    if (task.data().done) {
      changeStyleToDone(task.id);
    }
  });
  document.getElementById("title").value = "";
  document.getElementById("todo-subject").value = "-";
  document.getElementById("due-date").value = "";
  document.getElementById("todo-description").value = "";
}

window.seeDetail = async (taskId) => {
  let modal = document.getElementById("todo-details");
  const task = await getDoc(doc(db, "todos", taskId));
  if (!task.data().description) {
    modal.innerHTML = `
    <h2 style="margin-bottom: 5px">Details</h2>
    <p>-</p>`;
  } else {
    modal.innerHTML = `
    <h2 style="margin-bottom: 5px">Details</h2>
    <p>${task.data().description}</p>`;
  }
  document.getElementById("todo-modal").style.display = "block";
}

window.markDone = async (taskId) => {
  changeStyleToDone(taskId);
  await updateDoc(doc(db, `todos/${taskId}`), {done: true});
  filterTodo();
};

function changeStyleToDone(taskId) {
  const task = document.getElementById(taskId);
  task.style.textDecoration = "line-through";
  task.style.color = "rgb(189, 186, 186)";
  document.getElementById("remove-button-" + taskId).innerHTML += `
  <button class="remove" id="remove-subject" onclick="deleteTask('${taskId}')">
    <img src="assets/images/trash.png" style="width: 20px; height: 20px;" alt="trash">
  </button>`;
  const button = document.getElementById("button-" + taskId);
  button.innerHTML = "&check;";
  button.style.backgroundColor = "#2da44e";
  button.setAttribute("onclick", "undone('" + taskId + "');");
}

window.undone = async (taskId) => {
  await updateDoc(doc(db, `todos/${taskId}`), {done: false});
  filterTodo();
}

window.deleteTask = async (taskId) => {
  const docRef = doc(db, "todos/" + taskId);
  await deleteDoc(docRef);
  filterTodo();
};

async function getSubjectList() {
  subjectList = [];
  const q = await getDocs(query(subjectRef, where("uid", "==", currentUser)));
  q.forEach((sub) => {
    if (!subjectList.some(s => s.toLowerCase() === sub.data().subject.toLowerCase())) {
      subjectList.push(sub.data().subject);
    }
  });
  createSubjectOpt();
}

function createSubjectOpt() {
  let opt = document.getElementById("todo-subject");
  opt.innerHTML = `<option value="-" selected disabled hidden>subject</option>`;
  let filter = document.getElementById("filter");
  filter.innerHTML = `<option value="" selected disabled hidden>Filter</option>`;
  if (subjectList.length !== 0) {
    filter.innerHTML += `<option value="">All</option>`;
  }
  subjectList.forEach(function (sub) {
    let s = sub.charAt(0).toUpperCase() + sub.slice(1);
    opt.innerHTML += `<option value="${s}">${s}</option>`
    filter.innerHTML += `<option value="${s}">${s}</option>`;
  });
  if (subjectList.length !== 0) {
    opt.innerHTML += `<option value="-">Other</option>`;
    filter.innerHTML += `
    <option value="done">- - DONE - -</option>
    <option value="undone">- - UNDONE - -</option>
    <option value="-">Other</option>`;
  }
}

document.getElementById("filter").onchange = filterTodo;

function filterTodo() {
  let f = document.getElementById("filter").value;
  currentFilter = f;
  if (f === "All" || f === "") {
    drawTodo().then(null);
  } else if (f === "done") {
    drawTodo("done", true).then(null);
  } else if (f === "undone") {
    drawTodo("done", false).then(null);
  } else {
    drawTodo("Subject", f).then(null);
  }
}