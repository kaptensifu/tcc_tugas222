import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NoteList = () => {
  const [notes, setNote] = useState([]);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    const response = await axios.get("http://localhost:5000/notes");
    setNote(response.data);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ backgroundColor: '#B1AEAEFF', minHeight: '100vh', padding: '20px' }}>
    <div className="columns mt-5 is-centered">
      <div className="column is-full">
        <h1 className="has-text-centered is-size-2 has-text-weight-bold">To-Do List</h1> 
        <br />
        <table className="table is-striped is-fullwidth has-shadow">
          <thead>
            <tr>
              <th className="is-link has-text-centered">No</th>
              <th className="is-link has-text-centered">Judul</th>
              <th className="is-link has-text-centered">Deskripsi</th>
              <th className="is-link has-text-centered">Pembuat</th>
              <th className="is-link has-text-centered">Checklist</th> 
              <th className="is-link has-text-centered">Dibuat pada</th>
              <th className="is-link has-text-centered">Atur</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={note.id}>
                <td className="has-text-centered">{index + 1}</td>
                <td>{note.judul}</td>
                <td>{note.deskripsi}</td>
                <td>{note.pembuat}</td>
                
                <td className="has-text-centered"> 
                  <input type="checkbox" /> 
                </td>
                <td>
                  {`Jam ${new Date(note.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })} Tanggal ${new Date(note.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}`} 
                </td>
                <td className="has-text-centered">
                  <Link
                    to={`edit/${note.id}`}
                    className="button is-small is-info is-rounded mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="button is-small is-danger is-rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="has-text-centered mt-4"> 
          <Link to={`add`} className="button is-success is-medium is-rounded">
            Tambah Note !
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NoteList;  