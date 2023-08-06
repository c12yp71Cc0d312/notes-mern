import { useForm } from "react-hook-form";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { User as UserModel } from "../models/user";
import { Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";

interface LogInModalProps {
    onDismiss: () => void,
    onLogInSuccessful: (loggedInUser: UserModel) => void
}

const LogInModal = ({onDismiss, onLogInSuccessful}: LogInModalProps) => {

    const {register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const loggedInUser = await NotesApi.login(credentials);
            onLogInSuccessful(loggedInUser);   
        } catch (error) {
            console.log(error);
            alert(error);
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