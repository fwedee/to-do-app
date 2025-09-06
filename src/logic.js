// ---------- ID helper (robust + readable) ----------
const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// ---------- Note ----------
class note {
  constructor({
    id = uid(),
    title = "",
    description = "",
    dueDate = "",
    priority = "normal",
    content = "",
    done = false,
    creationDate = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.content = content;
    this.done = done;
    this.creationDate = creationDate;
  }

  display() {
    console.log(`Title: ${this.title}`);
    console.log(`Description: ${this.description}`);
    console.log(`DueDate: ${this.dueDate}`);
    console.log(`Priority: ${this.priority}`);
    console.log(`Content: ${this.content}`);
    console.log(`Done: ${this.done}`);
    console.log(`Creation Date: ${this.creationDate}`);
  }

  static fromJSON(obj) {
    return new note({ ...obj });
  }

  toJSON() {
    const { id, title, description, dueDate, priority, content, done, creationDate } = this;
    return { id, title, description, dueDate, priority, content, done, creationDate };
  }
}

// ---------- Project ----------
export class project {
  constructor({ id = uid(), name = "Untitled Project", notes = [] } = {}) {
    this.id = id;
    this.name = name;
    this.notes = notes.map((n) => (n instanceof note ? n : note.fromJSON(n)));
  }

  addNote(
    title,
    description = "",
    dueDate = "",
    priority = "normal",
    content = "",
    done = false
  ) {
    const newNote = new note({ title, description, dueDate, priority, content, done });
    this.notes.push(newNote);
    return newNote;
  }

  removeNoteById(noteId) {
    this.notes = this.notes.filter((n) => n.id !== noteId);
  }

  getNoteById(noteId) {
    return this.notes.find((n) => n.id === noteId);
  }

  listNotes() {
    if (this.notes.length === 0) {
      console.log("No notes available in this project.");
    } else {
      console.log(`Notes for project: ${this.name}`);
      this.notes.forEach((note) => note.display());
    }
  }

  static fromJSON(obj) {
    return new project({
      id: obj.id,
      name: obj.name,
      notes: (obj.notes || []).map((n) => note.fromJSON(n)),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      notes: this.notes.map((n) => n.toJSON()),
    };
  }
}

// ---------- Local Storage Layer (resilient) ----------
const STORAGE_KEY = "todo.projects.v1";
const SELECTED_KEY = "todo.selectedProjectId.v1";

function canUseLocalStorage() {
  try {
    const k = "__ls_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export const Storage = {
  load() {
    const ok = canUseLocalStorage();
    let projects = [];
    let selectedProjectId = null;

    if (ok) {
      const raw = localStorage.getItem(STORAGE_KEY);
      const rawSel = localStorage.getItem(SELECTED_KEY);

      if (raw) {
        try {
          const arr = JSON.parse(raw);
          projects = (Array.isArray(arr) ? arr : []).map((p) => project.fromJSON(p));
        } catch {
          projects = [];
        }
      }

      if (rawSel) selectedProjectId = rawSel;
    }

    return { projects, selectedProjectId };
  },

  save(projects, selectedProjectId) {
    if (!canUseLocalStorage()) {
      console.warn("LocalStorage unavailable; state not persisted.");
      return;
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects.map((p) => p.toJSON()))
      );
      if (selectedProjectId) {
        localStorage.setItem(SELECTED_KEY, selectedProjectId);
      } else {
        localStorage.removeItem(SELECTED_KEY);
      }
    } catch (e) {
      console.warn("Failed to save to LocalStorage:", e);
    }
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SELECTED_KEY);
  },
};
