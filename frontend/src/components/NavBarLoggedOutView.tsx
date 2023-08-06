import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onLogInClicked: () => void,
    onSignUpClicked: () => void
}

const NavBarLoggedOutView = ({onLogInClicked, onSignUpClicked}: NavBarLoggedOutViewProps) => {

    return (  
        <>
            <Button onClick={onLogInClicked}>Log In</Button>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
        </>
    );
}
 
export default NavBarLoggedOutView;