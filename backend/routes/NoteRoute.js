import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginHandler,
  logout
} from "../controllers/UserController.js";
import {
    getNotes, 
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../controllers/NoteController.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";


const router = express.Router();

//endpoint akses token
router.get('/token', refreshToken);
//endpoin auth
router.post('/login', loginHandler);
router.delete('/logout', logout);

//endpoint user
router.post("/register", createUser); //tambah user
router.get("/users",verifyToken, getUsers);
router.get("/users/:id", verifyToken,getUserById);
router.put("/edit-user/:id", verifyToken,updateUser);
router.delete("/delete-user/:id", deleteUser);

//endpoint note
router.get('/notes', verifyToken, getNotes);
router.get('/notes/:id', verifyToken, getNoteById);
router.post('/add-note', verifyToken, createNote);
router.patch('/edit-note/:id', verifyToken, updateNote);
router.delete('/delete-note/:id', verifyToken, deleteNote);

router.all('*', (req, res) => {
  res.status(404).json({
    status: "Failed",
    message: "Endpoint not found"
  });
});

export default router;



