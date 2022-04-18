// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEdbPO3YXkfcz29LiJPssZ7sLaxC8a57c",
  authDomain: "tua-shuai-33f59.firebaseapp.com",
  projectId: "tua-shuai-33f59",
  storageBucket: "tua-shuai-33f59.appspot.com",
  messagingSenderId: "380237340821",
  appId: "1:380237340821:web:b6bb76fe2ea6f9314dbb9c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  addDoc,
  setDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const db = getFirestore();
const users = collection(db, "user");

var currentUser;
var editScheduleModal = document.getElementById("edit-schedule");
var closeButton = document.getElementsByClassName("close")[0];
var editButton = document.getElementById("edit-schedule-button");
var loginWarningModal = document.getElementById("login-warning");

document.getElementById("username-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  let uid = document.getElementById("username").value;
  if (uid) {
    const user = await getDoc(doc(db, "user", uid));
    if(!user.exists()) {
        await setDoc(doc(db, "user", uid), {uid});
        console.log("create user");
    }
    currentUser = uid;
    console.log("current user " + currentUser);
    alert("You are login as " + currentUser);
  } else {
    currentUser = null;
    alert("Invalid ID or username");
  }
}, false);

editButton.onclick = function () {
  if (currentUser) {
    editScheduleModal.style.display = "block";
  } else {
    loginWarningModal.style.display = "block";
  }
};

closeButton.onclick = function () {
  editScheduleModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == editScheduleModal) {
    editScheduleModal.style.display = "none";
  } else if (event.target == loginWarningModal) {
    loginWarningModal.style.display = "none";
  }
};