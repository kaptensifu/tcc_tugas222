import React, { useState} from "react";
import axios from "axios";
import { useNavigate,} from "react-router-dom";
import 'bulma/css/bulma.min.css';

const Register = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/register`, {
        name,
        email,
        gender,
        password,
      });
      alert("Register berhasil! Silakan login.");
      navigate("/");      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="hero is-fullheight" style={{ backgroundColor: '#fffbe7' }}>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop is-6-tablet">
              <div className="box" style={{
                backgroundColor: '#fff8dc',
                border: '1px solid #f1e4b3',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h1 className="title has-text-centered" style={{ color: '#5a4e3c' }}>
                  📝 Buat Akun Note Keeper
                </h1>
                <form onSubmit={saveUser}>
                  <div className="field">
                    <label className="label" style={{ color: '#5a4e3c' }}>Username</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Buat username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-user" />
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" style={{ color: '#5a4e3c' }}>Email</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Masukkan Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" style={{ color: '#5a4e3c' }}>Gender</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Masukkan Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label" style={{ color: '#5a4e3c' }}>Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        placeholder="Buat password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                  </div>

                  
                  <div className="field mt-5">
                    <button className="button is-fullwidth" style={{
                      backgroundColor: '#fddc6c',
                      color: '#3d3d3d',
                      fontWeight: 'bold',
                      border: 'none'
                    }}>
                      Register
                    </button>
                  </div>
                </form>

                <p className="has-text-centered mt-4" style={{ color: '#5a4e3c' }}>
                  Sudah punya akun? <a href="/" style={{ color: '#c7923e' }}>Login di sini</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
