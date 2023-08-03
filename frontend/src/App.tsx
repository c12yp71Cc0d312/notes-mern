import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css'
import * as NotesApi from './network/notes_api';
import styleUtils from './styles/utils.module.css';
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from 'react-icons/fa';

function App() {
  // const [clickCount, setClickCount] = useState(0);
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  // useEffect can be used to execute side effects outside the rendering of the component itself
  useEffect(() => {
    async function loadNotes() {
      try {
        // const response = await fetch("/api/notes", {method: "GET"});
        // const notes = await response.json();
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error)
        // alert(error);
        setShowNotesLoadingError(true);
      }
      finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);
  // [] is the dependency array argument. Specifying variables in the array means when they change, it will execute the useEffect. Empty array means that the useEffect is executed only one time in the beginning. No dependency array means the useEffect would execute on every single render.

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));    // iterates through each element of notes and removes the note if its id equals the id of the deleted note
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid =
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {notes.map(note => (
        <Col key={note._id}>
          <Note
            note={note}
            onNoteClicked={setNoteToEdit}   // this works becaude onNoteClicked is a function that gets passed in NoteModel and setNoteToEdit takes a NoteModel as an argument
            className={styles.note}
            onDeleteNoteClicked={deleteNote} />
        </Col>
      ))}
    </Row>;

  return (
    <Container className={styles.NotesPage}>
      <Button className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>

      {notesLoading && <Spinner animation='border' variant='primary' />}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
      {!notesLoading && !showNotesLoadingError &&
        <>
          { notes.length > 0
              ? notesGrid
              : <p>You do not have any note.</p>
          }
        </>
      }

      {showAddNoteDialog &&
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      }
      {noteToEdit &&
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
            setNoteToEdit(null);
          }}
        />
      }

    </Container>
  );
}

export default App;
