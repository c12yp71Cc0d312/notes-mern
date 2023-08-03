import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String},
}, {timestamps: true});

// creates a type (for typescript) called Note using the schema of noteSchema 
type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);