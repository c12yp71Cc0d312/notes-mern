import { Certificate } from "crypto";
import { Note as NoteModel } from "../models/note";
import { User, User as UserModel } from "../models/user";

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

export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData("/api/users", {method: "GET"});
    // since both frontend and backend are in the same url, it will send cookies to the backend automatically
    // if they are in different domains/subdomains, we need to include fetch configuration explicitly in the fetch() call in fetchData()
    return response.json()
}

export interface SignUpCredentials {
    username: string,
    password: string,
    email: string
}

export async function signUp(credentials: SignUpCredentials): Promise<UserModel> {
    const response = await fetchData("/api/users/signup", 
    {   method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const response = await fetchData("/api/users/login",
    {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(credentials)
    });

    return response.json()
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
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