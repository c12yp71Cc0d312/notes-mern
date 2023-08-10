import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import styles from '../styles/NotesPage.module.css';
import { User as UserModel} from "../models/user";

interface NotesPageProps{
    loggedInUser: UserModel | null
}

const NotesPage = ({loggedInUser}: NotesPageProps) => {
    return (  
        <Container className={styles.NotesPage}>
          <>
            { loggedInUser
              ? <NotesPageLoggedInView/>
              : <NotesPageLoggedOutView/>
            }
          </>
    </Container>
    );
}
 
export default NotesPage;