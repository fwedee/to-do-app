import { project } from "./logic";
import "./styles.css";

const content = document.getElementById("content");

let currentProject = new project("My To-Do Project");

// ---------- UI BUILDERS ----------
function createProjectPage() {
  content.innerHTML = ""; // clear page

  createHeaderProjectPage(currentProject);
  createListProjectPage(currentProject);
}

const createHeaderProjectPage = (project) => {
  const header = document.createElement("header");

  const title = document.createElement("h2");
  title.innerText = project.name;
  header.appendChild(title);

  const inputForm = document.createElement("input");
  inputForm.id = "myInput";
  inputForm.placeholder = "Title...";
  inputForm.type = "text";
  header.appendChild(inputForm);

  const addButton = document.createElement("button");
  addButton.innerText = "Add";
  addButton.classList.add("addBtn");
  addButton.addEventListener("click", () => {
    const value = inputForm.value.trim();
    if (value) {
      currentProject.addNote(value, "", "", "", "", false);
      inputForm.value = "";
      createProjectPage();
    }
  });
  header.appendChild(addButton);

  content.appendChild(header);
};

const createListProjectPage = (project) => {
  const listContainer = document.createElement("div");
  listContainer.classList.add("listContainer");

  const list = document.createElement("ul");
  list.classList.add("noteList");

  project.notes.forEach((note, index) => {
    const noteElement = document.createElement("li");
    noteElement.innerText = note.title;
    noteElement.classList.add("note");

    if (note.done) {
      noteElement.classList.add("checked");
    }

    // Toggle note done state
    noteElement.addEventListener("click", () => {
      note.done = !note.done;
      createProjectPage();
    });

    // Close button
    const listBtn = document.createElement("button");
    listBtn.innerText = "\u00D7";
    listBtn.classList.add("close");
    listBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent toggle
      currentProject.notes.splice(index, 1);
      createProjectPage();
    });

    // Wrap note + button
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    wrapper.appendChild(noteElement);
    wrapper.appendChild(listBtn);

    const wrapperItem = document.createElement("li");
    wrapperItem.style.display = "flex";
    wrapperItem.style.width = "100%";
    wrapperItem.appendChild(noteElement);
    wrapperItem.appendChild(listBtn);

    list.appendChild(wrapperItem);
  });

  listContainer.appendChild(list);
  content.appendChild(listContainer);
};

// ---------- INIT ----------
createProjectPage();
