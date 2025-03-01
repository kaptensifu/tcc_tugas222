import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditNote = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pembuat, setPembuat] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getNoteById();
  }, []);

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/notes/${id}`, {
        judul,
        deskripsi,
        pembuat,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getNoteById = async () => {
    const response = await axios.get(`http://localhost:5000/notes/${id}`);
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