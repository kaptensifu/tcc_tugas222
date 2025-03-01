import {BrowserRouter, Routes, Route} from "react-router-dom";
import NoteList from "./components/NoteList.js";
import AddNote from "./components/AddNote.js";
import EditNote from "./components/EditNote.js";
import "bulma/css/bulma.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NoteList/>}/>
        <Route path="add" element={<AddNote/>}/>
        <Route path="edit/:id" element={<EditNote/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
