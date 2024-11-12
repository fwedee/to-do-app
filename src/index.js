import { project } from "./logic";

import styles from "./styles.css";

const content = document.getElementById("content");

function createProjectPage() {
  createHeaderProjectPage(test);
  createListProjectPage(test);
}

const createHeaderProjectPage = (project) => {
  const header = document.createElement("header");

  const title = document.createElement("h2");
  title.innerText = `${project.name}`;
  header.appendChild(title);

  const inputForm = document.createElement("input");
  inputForm.setAttribute("id", "myInput");
  inputForm.setAttribute("placeholder", "Title...");
  inputForm.setAttribute("type", "text");
  header.appendChild(inputForm);

  const addButton = document.createElement("button");
  addButton.addEventListener("click", () => {
    createElement();
  });
  addButton.innerText = "Add";
  addButton.classList.add("addBtn");
  header.appendChild(addButton);

  content.appendChild(header);
};

const createListProjectPage = (project) => {
  const listContainer = document.createElement("div");
  listContainer.classList.add("listContainer");

  const list = document.createElement("ul");
  list.classList.add("noteList");

  project.notes.forEach((note) => {
    const noteElement = document.createElement("li");
    noteElement.innerText = `${note.title}`;
    noteElement.classList.add("note");

    if (note.done) {
      noteElement.classList.add("checked");
    }

    list.appendChild(noteElement);

    const listBtn = document.createElement("button");
    listBtn.innerText = "\u00D7";
    listBtn.classList.add("close");
    listBtn.addEventListener("click", () => {
      deleteElement(listBtn);
    });

    list.appendChild(listBtn);
  });

  listContainer.appendChild(list);

  content.appendChild(listContainer);
};

function createElement() {
  let input = document.getElementById("myInput").value;

  const listContainer = document.querySelector(".noteList");

  const noteElement = document.createElement("li");
  noteElement.innerText = `${input}`;
  noteElement.classList.add("note");

  listContainer.appendChild(noteElement);

  const listBtn = document.createElement("button");
  listBtn.innerText = "\u00D7";
  listBtn.classList.add("close");
  listBtn.addEventListener("click", () => {
    deleteElement();
  });

  listContainer.appendChild(listBtn);
}

function deleteElement(element) {
  const nextNote = element.previousElementSibling;
  nextNote.remove();
  element.remove();
}

let test = new project("test");

test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);
test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);

test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);
test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);
test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);
test.addNote("test1", "WoW", "2020", "important", "adadadadda", false);

test.listNotes();

createProjectPage();
