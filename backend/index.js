import express from "express";
import cors from "cors";
import NoteRoute from "./routes/NoteRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


const app = express();

dotenv.config();
app.use(cookieParser());
app.use(cors({ 
  origin: 'http://localhost:3000', // ganti sesuai frontend kamu
  credentials: true 
}));
app.use(express.json());
app.use(NoteRoute);

app.listen(5000, ()=> console.log('Server up and running...'));