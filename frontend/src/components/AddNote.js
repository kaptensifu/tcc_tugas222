import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils";

const AddNote = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pembuat, setPembuat] = useState("");
  const navigate = useNavigate();

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/add-note`, {
        judul,
        deskripsi,
        pembuat,
      });
      navigate("/");
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