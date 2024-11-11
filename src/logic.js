class note {
  constructor(title, description, dueDate, priority, content, done) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.content = content;
    this.done = done;
    this.creationDate = new Date();
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
}

class project {
  constructor(name) {
    this.name = name;
    this.notes = [];
    this.numberOfNotes = 0;
  }

  addNote(title, description, dueDate, priority, content, done) {
    const newNote = new note(
      title,
      description,
      dueDate,
      priority,
      content,
      done
    );
    this.notes.push(newNote);

    this.numberOfNotes += 1;
  }

  removeNote(title) {
    this.notes = this.notes.filter((note) => note.title !== title);
  }

  listNotes() {
    if (this.notes.length === 0) {
      console.log("No notes available in this project.");
    } else {
      console.log(`Notes for project: ${this.name}`);
      this.notes.forEach((note) => note.display());
    }
  }
}

// Test
let test = new project("test");

test.addNote("test1", "WoW", "2020", "important", "adadadadda", "yes");

test.listNotes();
