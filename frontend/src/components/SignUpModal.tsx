import { Button, Form, Modal } from "react-bootstrap";
import { User as UserModel } from "../models/user";
import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css"

interface SignUpModalProps {
    onDismiss: () => void,  // function with no arguments and no return type
    onSignUpSuccessful: (user: UserModel) => void,
}

const SignUpModal = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {

    const {register, handleSubmit, formState: {errors, isSubmitting} } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await NotesApi.signUp(credentials)
            onSignUpSuccessful(newUser)
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
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
                        placeholder="username"
                    />

                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        register={register}
                        registerOptions={{required: true}}
                        error={errors.email}
                        placeholder="email"
                    />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        register={register}
                        registerOptions={{required: true}}
                        error={errors.password}
                        placeholder="password"
                    />

                    <Button
                        // form attribute not req as this button is inside the <Form>
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
    );
}
 
export default SignUpModal;