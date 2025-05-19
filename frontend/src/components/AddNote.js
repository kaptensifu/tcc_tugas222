import React, { useState, useEffect } from "react";
import AxiosInstance from "../api/AxiosInstance"; // Ganti axios dengan AxiosInstance
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";
import "bulma/css/bulma.css";

const AddNote = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pembuat, setPembuat] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect ke halaman login jika tidak terautentikasi
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/add-note", { // Hapus BASE_URL dan gunakan AxiosInstance
        judul,
        deskripsi,
        pembuat,
      });
      navigate("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ backgroundColor: '#B1AEAEFF', minHeight: '100vh', padding: '20px' }}>
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <div className="box"> 
          <h1 className="has-text-centered is-size-2">Tambah Note</h1>
          <div className="has-text-centered mb-4">
            <p className="is-size-5">Pengguna: {user?.name || "Guest"}</p>
          </div>
          <form onSubmit={saveNote}>
            <div className="field">
              <label className="label">Judul</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Judul"
                  required
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
                  required
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
                  required
                />
              </div>
            </div>
            <div className="has-text-centered mt-4">
              <button type="submit" className="button is-success is-rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AddNote;