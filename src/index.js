import { project, Storage } from "./logic.js";
import "./styles.css";
// ----- App State -----
let { projects, selectedProjectId } = Storage.load();

if (projects.length === 0) {
  const p = new project({ name: "My First Project" });
  p.addNote("Welcome!", "Click me to toggle done", "", "normal", "", false);
  projects.push(p);
  selectedProjectId = p.id;
  Storage.save(projects, selectedProjectId);
}

const $ = (sel) => document.querySelector(sel);

// Root containers from index.html
const sidebar = $("#sidebar");
const content = $("#content");

// ----- Rendering -----
function render() {
  renderSidebar();
  renderMain();
}

function renderSidebar() {
  sidebar.innerHTML = "";

  const title = document.createElement("div");
  title.className = "sidebar-title";
  title.textContent = "Projects";
  sidebar.appendChild(title);

  // Add project form
  const form = document.createElement("div");
  form.className = "project-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New project name…";
  input.setAttribute("aria-label", "New project name");

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add";
  addBtn.addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return;
    const p = new project({ name });
    projects.push(p);
    selectedProjectId = p.id;
    persist();
    render();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  form.appendChild(input);
  form.appendChild(addBtn);
  sidebar.appendChild(form);

  // Projects list
  const list = document.createElement("ul");
  list.className = "project-list";

  projects.forEach((p) => {
    const li = document.createElement("li");
    li.className = "project-item" + (p.id === selectedProjectId ? " active" : "");
    li.title = p.name;

    const name = document.createElement("div");
    name.className = "project-name";
    name.textContent = p.name;

    li.addEventListener("click", () => {
      selectedProjectId = p.id;
      persist();
      render();
    });

    const actions = document.createElement("div");
    actions.className = "project-actions";

    // rename
    const renameBtn = document.createElement("button");
    renameBtn.setAttribute("aria-label", "Rename project");
    renameBtn.textContent = "✎";
    renameBtn.title = "Rename";
    renameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newName = prompt("New project name:", p.name);
      if (newName && newName.trim()) {
        p.name = newName.trim();
        persist();
        render();
      }
    });

    // delete
    const delBtn = document.createElement("button");
    delBtn.setAttribute("aria-label", "Delete project");
    delBtn.textContent = "🗑";
    delBtn.title = "Delete";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm(`Delete project "${p.name}"? This cannot be undone.`)) return;
      projects = projects.filter((x) => x.id !== p.id);
      if (selectedProjectId === p.id) {
        selectedProjectId = projects[0]?.id || null;
      }
      persist();
      render();
    });

    actions.appendChild(renameBtn);
    actions.appendChild(delBtn);

    li.appendChild(name);
    li.appendChild(actions);

    list.appendChild(li);
  });

  sidebar.appendChild(list);

  // Utility area
  const utility = document.createElement("div");
  utility.style.marginTop = "16px";
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Clear all data";
  resetBtn.addEventListener("click", () => {
    if (!confirm("Clear all projects and notes from this browser?")) return;
    Storage.clearAll();
    projects = [];
    selectedProjectId = null;
    const p = new project({ name: "My First Project" });
    p.addNote("Welcome!", "Click me to toggle done", "", "normal", "", false);
    projects.push(p);
    selectedProjectId = p.id;
    persist();
    render();
  });
  utility.appendChild(resetBtn);
  sidebar.appendChild(utility);
}

function renderMain() {
  content.innerHTML = "";
  const current = projects.find((p) => p.id === selectedProjectId);

  // Header
  const header = document.createElement("header");
  const title = document.createElement("h2");
  title.textContent = current ? current.name : "No Project";
  header.appendChild(title);

  // Add-note row
  const row = document.createElement("div");
  row.className = "header-row";

  const input = document.createElement("input");
  input.id = "myInput";
  input.placeholder = "Title...";
  input.type = "text";

  const addButton = document.createElement("button");
  addButton.innerText = "Add";
  addButton.classList.add("addBtn");
  addButton.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value || !current) return;
    current.addNote(value, "", "", "normal", "", false);
    input.value = "";
    persist();
    renderMain(); // re-render only main for snappier UX
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addButton.click();
  });

  row.appendChild(input);
  row.appendChild(addButton);
  header.appendChild(row);

  content.appendChild(header);

  // Notes list
  const listContainer = document.createElement("div");
  listContainer.classList.add("listContainer");

  if (!current || current.notes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No notes yet. Add your first one above.";
    listContainer.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.classList.add("noteList");

    current.notes.forEach((n) => {
      const li = document.createElement("li");
      li.className = "note-item" + (n.done ? " checked" : "");
      li.dataset.id = n.id;
      li.textContent = n.title;

      // Toggle done when clicking the row
      li.addEventListener("click", () => {
        const note = current.getNoteById(n.id);
        if (!note) return;
        note.done = !note.done;
        persist();
        // Toggle class quickly without full rerender
        li.classList.toggle("checked", note.done);
      });

      // Close (delete) button
      const close = document.createElement("button");
      close.className = "close";
      close.setAttribute("aria-label", "Delete note");
      close.textContent = "\u00D7";
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        current.removeNoteById(n.id);
        persist();
        renderMain();
      });

      // Put the text on the left and close on the right (same <li>)
      // Since we set li.textContent above, append close will replace content,
      // so instead do this:
      li.textContent = "";
      const span = document.createElement("span");
      span.textContent = n.title;
      span.style.flex = "1 1 auto";
      li.appendChild(span);
      li.appendChild(close);

      list.appendChild(li);
    });

    listContainer.appendChild(list);
  }

  // Footer actions
  const actions = document.createElement("div");
  actions.className = "main-actions";

  const clearDone = document.createElement("button");
  clearDone.textContent = "Clear completed";
  clearDone.addEventListener("click", () => {
    if (!current) return;
    current.notes = current.notes.filter((n) => !n.done);
    persist();
    renderMain();
  });

  const sortNewFirst = document.createElement("button");
  sortNewFirst.textContent = "Sort: Newest first";
  sortNewFirst.addEventListener("click", () => {
    if (!current) return;
    current.notes.sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    );
    persist();
    renderMain();
  });

  actions.appendChild(clearDone);
  actions.appendChild(sortNewFirst);

  content.appendChild(listContainer);
  content.appendChild(actions);
}

// ----- Persistence -----
function persist() {
  Storage.save(projects, selectedProjectId);
}

// ----- Boot -----
render();
