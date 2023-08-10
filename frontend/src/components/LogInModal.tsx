import { useForm } from "react-hook-form";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { User as UserModel } from "../models/user";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";

interface LogInModalProps {
    onDismiss: () => void,
    onLogInSuccessful: (loggedInUser: UserModel) => void
}

const LogInModal = ({onDismiss, onLogInSuccessful}: LogInModalProps) => {

    const [errorText, setErrorText] = useState<string|null>(null);

    const {register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const loggedInUser = await NotesApi.login(credentials);
            onLogInSuccessful(loggedInUser);   
        } catch (error) {
            if(error instanceof UnauthorizedError) {
                setErrorText(error.message);
            }
            else {
                alert(error);
            }
            console.log(error);
        }
    }

    return ( 

        <Modal show onHide={onDismiss}>

            <Modal.Header closeButton>
                <Modal.Title>
                    Log In
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        register={register}
                        registerOptions={{required: true}}
                        error={errors.username}
                    />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        register={register}
                        registerOptions={{required: true}}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >
                        Log In
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>

    );
}
 
export default LogInModal;