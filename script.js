import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

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
  collection,
  doc,
  getDoc,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const db = getFirestore();

var currentUser;
var editScheduleModal = document.getElementById("edit-schedule");
var loginWarningModal = document.getElementById("login-warning");
var addAssignmentModal = document.getElementById("add-assignment")

document.getElementById("username-form").addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();
    let uid = document.getElementById("username").value;
    if (uid) {
      const user = await getDoc(doc(db, "users", uid));
      if (!user.exists()) {
        await setDoc(doc(db, "users", uid), { uid });
        console.log("create user");
      }
      currentUser = uid;
      console.log("current user " + currentUser);
      alert("You are login as " + currentUser);
    } else {
      currentUser = null;
      alert("Invalid ID or username");
    }
  },
  false
);

document.getElementById("edit-schedule-button").onclick = function () {
  if (currentUser) {
    editScheduleModal.style.display = "block";
  } else {
    loginWarningModal.style.display = "block";
  }
};

document.getElementById("close-schedule-modal-button").onclick = function() {
  editScheduleModal.style.display = "none";
};

document.getElementById("add-assignment-button").onclick = function() {
  if (currentUser) {
    addAssignmentModal.style.display = "block";
  } else {
    loginWarningModal.style.display = "block";
  }
};

document.getElementById("close-assignment-modal").onclick = function() {
  addAssignmentModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == editScheduleModal) {
    editScheduleModal.style.display = "none";
  } else if (event.target == loginWarningModal) {
    loginWarningModal.style.display = "none";
  } else if(event.target == addAssignmentModal) {
    addAssignmentModal.style.display = "none"
  } 
};

