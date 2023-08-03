import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {

    try {
        // throw Error("Bazinga");
        // executes the find operation on notes. exec() returns a promise and is an asynchronous function
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);    
    } catch (error) {
        next(error);
    }
    
};

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {

        if(!mongoose.isValidObjectId(noteId))
            throw(createHttpError(400, "Invalid note id"));

        const note = await NoteModel.findById(noteId).exec();

        if(!note)
            throw(createHttpError(404, "Note not found"));

        res.status(200).json(note);

    } catch (error) {
        next(error);
    }

}

interface CreateNoteBody {
    title?: string,
    text?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const text = req.body.text;
    const title = req.body.title;

    try {

        if(!title)
            throw(createHttpError(400, "Note must have a title"));

        // create() returns a promise be default, unlike find()
        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });

        res.status(201).json(newNote);

    } catch (error) {
        next(error);
    }

}

interface UpdateNoteParams {
    noteId: string,
}

interface UpdateNoteBody {
    title?: string,
    text?: string,
}

export const updateNode: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {

    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        
        if(!mongoose.isValidObjectId(noteId))
            throw(createHttpError(400, "Invalid note id"));

        const note = await NoteModel.findById(noteId).exec();

        if(!note)
            throw(createHttpError(404, "Note not found"));

        if(!newTitle)
            throw(createHttpError(400, "Note must have a title"));

        note.title = newTitle;
        note.text = newText;

        const updatedNode = await note.save();

        res.status(200).json(updatedNode);

    } catch (error) {
        next(error);
    }

}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        
        if(!mongoose.isValidObjectId(noteId))
            throw(createHttpError(400, "Invalid note id"));
        
        const note = await NoteModel.findById(noteId).exec();

        if(!note)
            throw(createHttpError(404, "Note not found"));

        await NoteModel.findByIdAndDelete(noteId);

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }

}