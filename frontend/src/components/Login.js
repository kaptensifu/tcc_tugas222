import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";
import 'bulma/css/bulma.min.css';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await login({ name, password });
            navigate('/notes');
        } catch (err) {
            setError('Login gagal! Periksa username dan password.');
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
                                    📝 Note Keeper Login
                                </h1>
                                
                                {error && (
                                    <div className="notification is-danger">
                                        {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleLogin}>
                                    <div className="field">
                                        <label className="label" style={{ color: '#5a4e3c' }}>Username</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="text"
                                                placeholder="Masukkan username"
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
                                        <label className="label" style={{ color: '#5a4e3c' }}>Password</label>
                                        <div className="control has-icons-left">
                                            <input
                                                className="input"
                                                type="password"
                                                placeholder="Masukkan password"
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
                                        <button 
                                            className="button is-fullwidth" 
                                            style={{
                                                backgroundColor: '#fddc6c',
                                                color: '#3d3d3d',
                                                fontWeight: 'bold',
                                                border: 'none'
                                            }}
                                            type="submit"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>

                                <p className="has-text-centered mt-4" style={{ color: '#5a4e3c' }}>
                                    Belum punya akun? <a href="/register" style={{ color: '#c7923e' }}>Daftar di sini</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;