import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, select: false},
    passsword: {type: String, required: true, select: false},
});
// select: false indicates when we retrieve user from the db, email and password wont be retrieved by default unless we explicitly request for it

// creates a type (for typescript) called User using the schema of userSchema 
type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);     // "User" will be the name of our collection in the db