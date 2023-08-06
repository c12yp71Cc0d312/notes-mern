import { Button, Form, Modal } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
    noteToEdit?: NoteModel,
    onDismiss: () => void,  // function with no arguments and no return type
    onNoteSaved: (note: NoteModel) => void,     // note is the newly added note
}

const AddEditNoteDialog = ({noteToEdit, onDismiss, onNoteSaved}: AddEditNoteDialogProps) => {
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<NoteInput>( {
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
        }
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: NoteModel;
            if(noteToEdit)
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input)
            else
                noteResponse = await NotesApi.createNote(input);
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return ( 
        // onHide called when we click outside of the note or click the closeButton
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit note" : "Add new note"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>

                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"         // rest prop
                        placeholder="Title"     // rest prop
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                    />

                    <TextInputField
                        name="text"
                        label="Text"
                        register={register}
                        as="textarea"
                        rows={5}
                        placeholder="Text"
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                type="submit"
                form="addEditNoteForm"
                disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddEditNoteDialog;