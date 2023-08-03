import express from "express";
import * as NotesController from "../controller/notes";

const router = express.Router();

router.get("/", NotesController.getNotes);

router.get("/:noteId", NotesController.getNote);

router.post("/", NotesController.createNote);

router.patch("/:noteId", NotesController.updateNode);

router.delete("/:noteId", NotesController.deleteNote);

export default router;