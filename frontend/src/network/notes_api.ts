import { Note as NoteModel } from "../models/note";

// fetch function that throws error on the frontend
async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok)
        return response;
    else {
        const errorBody = await response.json();
        const errorMessage = await errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchNotes(): Promise<NoteModel[]> {
    const response = await fetchData("/api/notes", {method: "GET"});
    return response.json();
}

export interface NoteInput {
    title: string,
    text?: string
}

export async function createNote(note: NoteInput) {
    const response = await fetchData("/api/notes", 
    {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(note),
    });

    return response.json();
}

export async function updateNote(noteId: String, note: NoteInput): Promise<NoteModel> {
    const response = await fetchData(`/api/notes/${noteId}`, 
    {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(note),
    });

    return response.json();
}

export async function deleteNote(noteId: string) {
    await fetchData(`/api/notes/${noteId}`, { method: "DELETE" });
}