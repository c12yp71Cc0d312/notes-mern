import { Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { User as UserModel } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
    loggedInUser: UserModel | null,
    onSignUpClicked: () => void,
    onLogInClicked: () => void,
    onLogOutSuccessful: () => void
}

const NavBar = ({loggedInUser, onSignUpClicked, onLogInClicked, onLogOutSuccessful}: NavBarProps) => {
    return ( 
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
            <Container>
                {/* Rendering a react-router-dom Link with the styling of the bootstrap NavbarBrand */}
                <NavbarBrand as={Link} to="/">
                    Cool Notes App
                </NavbarBrand>
                <Navbar.Toggle aria-controls="main-navbar"/>
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        {/* Rendering a react-router-dom Link with the styling of the bootstrap Nav.Link */}
                        <Nav.Link as={ Link } to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {
                            loggedInUser
                            ? <NavBarLoggedInView user={loggedInUser} onLogOutSuccessful={onLogOutSuccessful}/>
                            : <NavBarLoggedOutView onLogInClicked={onLogInClicked} onSignUpClicked={onSignUpClicked}/>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
 
export default NavBar;