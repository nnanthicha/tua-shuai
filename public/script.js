// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjjqsAtKRRcrjagZM0DDa0Cv_0rkrUHFI",
  authDomain: "cee-spa-final-project.firebaseapp.com",
  projectId: "cee-spa-final-project",
  storageBucket: "cee-spa-final-project.appspot.com",
  messagingSenderId: "136727063750",
  appId: "1:136727063750:web:356466c82a90c09b96fbc7",
  measurementId: "G-2B80Z4VB59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//=======================================================================

var editScheduleModal = document.getElementById("edit-schedule")
var closeScheduleModalButton = document.getElementsByClassName("close-schedule-modal")[0]
var editButton = document.getElementById("edit-schedule-button")
var addAssignmentModal = document.getElementById("add-assignment")
var addAssignmentButton = document.getElementsByClassName("add-assignment-button")[0]
var closeAssignmentModalButton = document.getElementsByClassName("close-assignment-modal")[0]

editButton.onclick = function() {
    editScheduleModal.style.display = "block"
}

closeScheduleModalButton.onclick = function() {
    editScheduleModal.style.display = "none"
}

window.onclick = function(event) {
    if(event.target == editScheduleModal) {
        editScheduleModal.style.display = "none"
    }
    if(event.target == addAssignmentModal) {
        addAssignmentModal.style.display = "none"
    } 
}

addAssignmentButton.onclick = function() {
    addAssignmentModal.style.display = "block"
}

closeAssignmentModalButton.onclick = function() {
    addAssignmentModal.style.display = "none"
}