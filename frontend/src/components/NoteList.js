// 1. First, fix NoteList.js to use AxiosInstance instead of axios
// src/components/NoteList.js

import React, { useState, useEffect } from "react";
import AxiosInstance from "../api/AxiosInstance"; // Use AxiosInstance instead of axios
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";
import "bulma/css/bulma.css";

const NoteList = () => {
  const [notes, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("/notes"); // Use AxiosInstance
      setNote(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Gagal mengambil data catatan");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      await AxiosInstance.delete(`/delete-note/${id}`); // Use AxiosInstance
      getNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log("Logout gagal:", error);
    }
  };

  if (loading) {
    return (
      <div className="hero is-fullheight" style={{ backgroundColor: '#B1AEAEFF' }}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">Memuat Data...</h1>
            <progress className="progress is-primary" max="100"></progress>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight" style={{ backgroundColor: '#B1AEAEFF' }}>
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="notification is-danger">
              <p>{error}</p>
              <button className="button is-info mt-4" onClick={getNotes}>Coba Lagi</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#B1AEAEFF', minHeight: '100vh', padding: '20px' }}>
      <div className="columns mt-5 is-centered">
        <div className="column is-full">
          <div className="level mb-4">
            <div className="level-left">
              <h1 className="title has-text-weight-bold">To-Do List</h1>
            </div>
            <div className="level-right">
              <button
                onClick={handleLogout}
                className="button is-danger is-light is-rounded"
              >
                Logout
              </button>
            </div>
          </div>
          
          {notes && notes.length > 0 ? (
            <>
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
                          to={`/edit/${note.id}`}
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
            </>
          ) : (
            <div className="box has-text-centered">
              <p className="is-size-5">Belum ada catatan yang tersedia</p>
            </div>
          )}

          <div className="has-text-centered mt-4">
            <Link to={`/add`} className="button is-success is-medium is-rounded">
              Tambah Note !
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteList;