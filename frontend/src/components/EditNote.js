import React, { useState, useEffect } from "react";
import AxiosInstance from "../api/AxiosInstance"; // Ganti axios dengan AxiosInstance
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";
import "bulma/css/bulma.css";

const EditNote = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pembuat, setPembuat] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect ke halaman login jika tidak terautentikasi
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    // Jika sudah terautentikasi, ambil data note
    getNoteById();
  }, [isAuthenticated, navigate, id]);

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.patch(`/edit-note/${id}`, { // Hapus BASE_URL dan gunakan AxiosInstance
        judul,
        deskripsi,
        pembuat,
      });
      navigate("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  const getNoteById = async () => {
    const response = await AxiosInstance.get(`/notes/${id}`); // Hapus BASE_URL dan gunakan AxiosInstance
    setJudul(response.data.judul);
    setDeskripsi(response.data.deskripsi);
    setPembuat(response.data.pembuat);
  };

  return (
    <div style={{ backgroundColor: '#B1AEAEFF', minHeight: '100vh', padding: '20px' }}>
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div className="box"> 
          <h1 className="has-text-centered is-size-2">Edit Note</h1>
          <div className="has-text-centered mb-4">
            <p className="is-size-5">Pengguna: {user?.name || "Guest"}</p>
          </div>
          <form onSubmit={updateNote}>
            <div className="field">
              <label className="label">Judul</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Judul"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Deskripsi</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Pembuat</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={pembuat}
                  onChange={(e) => setPembuat(e.target.value)}
                  placeholder="Pembuat"              
                />
              </div>
            </div>
            <div className="has-text-centered mt-4">
              <button type="submit" className="button is-success is-rounded">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditNote;