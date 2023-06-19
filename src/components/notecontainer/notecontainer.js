import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './notecontainer.css';
import addnoteicon from './assets/addnote.png';
import editicon from './assets/edit.png';
import deleteicon from './assets/delete.png';

const backendURL = 'http://localhost:3001';

function NoteContainer(props) {
  const [newNoteText, setNewNoteText] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get(`${backendURL}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setNotes(response.data);
        })
        .catch((error) => {
          console.error('Error fetching notes:', error);
        });
    }
  };

  const handleNoteChange = (event) => {
    setNewNoteText(event.target.value);
  };

  const addNote = () => {
    const newNote = {
      username: props.username,
      text: newNoteText,
      time: getCurrentTime(),
      color: getRandomColor(),
    };

    const token = localStorage.getItem('token');

    if (token) {
      axios
        .post(`${backendURL}/api/notes`, newNote, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Note saved:', response.data);
          setNewNoteText('');
          fetchNotes();
        })
        .catch((error) => {
          console.error('Error saving note:', error);
        });
    }
  };

  const editNote = (noteId, newText) => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .put(
          `${backendURL}/api/notes/${noteId}`,
          { text: newText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log('Note updated:', response.data);
          fetchNotes();
        })
        .catch((error) => {
          console.error('Error updating note:', error);
        });
    }
  };

  const deleteNote = (noteId) => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .delete(`${backendURL}/api/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Note deleted:', response.data);
          fetchNotes();
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
        });
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRandomColor = () => {
    const colors = ['#71218f'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className="note-container">
      <div className="headertext">
        <div className="inputheader">
          <div className="add-note">
            <input
              className="input-field"
              placeholder="Add your note here"
              type="text"
              value={newNoteText}
              onChange={handleNoteChange}
            />
            <button className="add-note-button" onClick={addNote}>
              <img src={addnoteicon} alt="Add Note" className="add-note-icon" />
              Add note
            </button>
          </div>
        </div>
      </div>
      <div className="heading">
        <h1>Notes list</h1>
      </div>
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note._id} className="note" style={{ backgroundColor: note.color }}>
            <p className="note-text">{note.text}</p>
            <p className="note-time">{note.time}</p>
            <div className="note-actions">
              <img
                src={editicon}
                alt="Edit Note"
                className="edit-icon"
                onClick={() => {
                  const newText = prompt('Enter new note text:');
                  if (newText) {
                    editNote(note._id, newText);
                  }
                }}
              />
              <img
                src={deleteicon}
                alt="Delete Note"
                className="delete-icon"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this note?')) {
                    deleteNote(note._id);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteContainer;
