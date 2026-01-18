    const STORAGE_KEY = "tasks";

    let tasks = [];

    function loadTasks() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function render() {
      const list = document.querySelector("#taskList");
      list.innerHTML = "";

      tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !!task.done;
        checkbox.addEventListener("change", () => {
          tasks[index].done = checkbox.checked;
          saveTasks();
          render();
        });

        const span = document.createElement("span");
        span.className = "text" + (task.done ? " done" : "");
        span.textContent = task.text;

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Smazat";
        delBtn.addEventListener("click", () => {
          tasks.splice(index, 1);
          saveTasks();
          render();
        });

        const spacer = document.createElement("div");
        spacer.className = "spacer";

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(spacer);
        li.appendChild(delBtn);
        list.appendChild(li);
      });
    }

    function normalizeInput(value) {
      return value.trim();
    }

    document.addEventListener("DOMContentLoaded", () => {
      const input = document.querySelector("#taskInput");
      const addBtn = document.querySelector("#addBtn");
      const form = document.querySelector("#taskForm");

      tasks = loadTasks();
      render();

      input.addEventListener("input", () => {
        const text = normalizeInput(input.value);
        addBtn.disabled = (text.length === 0);
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const text = normalizeInput(input.value);
        if (text.length === 0) return;

        tasks.push({ text, done: false });
        saveTasks();
        render();

        input.value = "";
        addBtn.disabled = true;
        input.focus();
      });

      document.querySelector("#clearDoneBtn").addEventListener("click", () => {
        tasks = tasks.filter(t => !t.done);
        saveTasks();
        render();
      });

      document.querySelector("#clearAllBtn").addEventListener("click", () => {
        tasks = [];
        saveTasks();
        render();
      });
    });