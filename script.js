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