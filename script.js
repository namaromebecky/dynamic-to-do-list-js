// script.js
// Adds persistence to the To-Do app via localStorage
document.addEventListener('DOMContentLoaded', () => {
  // Select DOM elements
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // In-memory tasks array (keeps sync with localStorage)
  let tasks = [];

  // Save the tasks array to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  /**
   * addTask
   * Adds a task to the DOM and optionally saves it.
   * @param {string|null} taskText - The task text. If null, read from taskInput.
   * @param {boolean} save - Whether to save this task to localStorage (default true).
   */
  function addTask(taskText = null, save = true) {
    // Determine taskText source
    if (taskText === null) {
      taskText = taskInput.value.trim();
    } else {
      taskText = String(taskText).trim();
    }

    // If empty, do nothing
    if (taskText === '') {
      return;
    }

    // Create DOM elements for the task
    const li = document.createElement('li');

    // Use a span for the text so it's easy to read the text (and not include the button text)
    const span = document.createElement('span');
    span.textContent = taskText;
    li.appendChild(span);

    // Create remove button (use className, not classList.add)
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';

    // Remove handler: remove from DOM and update tasks array + localStorage
    removeBtn.onclick = function () {
      // Remove element from DOM
      taskList.removeChild(li);

      // Remove only the first matching occurrence from tasks array
      const index = tasks.indexOf(taskText);
      if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
      }
    };

    li.appendChild(removeBtn);
    taskList.appendChild(li);

    // If requested, add to tasks array and save
    if (save) {
      tasks.push(taskText);
      saveTasks();
    }

    // Clear input field (only when input source was used)
    if (taskInput.value) taskInput.value = '';
  }

  // Load tasks from localStorage and populate the list
  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    // Initialize in-memory array
    tasks = Array.isArray(storedTasks) ? storedTasks.slice() : [];

    // Add each saved task to the DOM but don't re-save them
    tasks.forEach(t => addTask(t, false));
  }

  // Event listeners
  addButton.addEventListener('click', () => addTask());
  taskInput.addEventListener('keypress', function (event) {
    // Use event.key === 'Enter' as required
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Initialize UI from localStorage
  loadTasks();
});
