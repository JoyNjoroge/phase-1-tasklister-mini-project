document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-task-form");
  const input = document.getElementById("new-task-description");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevents page reload
    const taskText = input.value;

    if (taskText.trim() !== "") {
      addTaskToDOM(taskText);
      form.reset(); // clears input field
    }
  });
});

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.textContent = task;

  const ul = document.getElementById("tasks");
  ul.appendChild(li);
}
