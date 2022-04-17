var editScheduleModal = document.getElementById("edit-schedule")
var closeButton = document.getElementsByClassName("close")[0]
var editButton = document.getElementById("edit-schedule-button")

editButton.onclick = function() {
    editScheduleModal.style.display = "block"
}

closeButton.onclick = function() {
    editScheduleModal.style.display = "none"
}

window.onclick = function(event) {
    if(event.target == editScheduleModal) {
        editScheduleModal.style.display = "none"
    }
}