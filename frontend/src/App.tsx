import { Container } from 'react-bootstrap';
import styles from './styles/NotesPage.module.css';
import LogInModal from './components/LogInModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { useEffect, useState } from 'react';
import { User as UserModel } from './models/user';
import * as NotesApi from "./network/notes_api";
import NotesPageLoggedInView from './components/NotesPageLoggedInView';
import NotesPageLoggedOutView from './components/NotesPageLoggedOutView';

function App() {

  const [loggedInUser, setLoggedInUser] = useState<UserModel|null>(null);

  const [showLogInModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  useEffect(() => {
    async function getLoggedInUser() {
      try {
        const loggedInUser = await NotesApi.getLoggedInUser();
        setLoggedInUser(loggedInUser);
      } catch (error) {
        console.error(error);
      }
    }
    getLoggedInUser();
  })

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onSignUpClicked={() => {setShowSignUpModal(true)}}
        onLogInClicked={() => {setShowLoginModal(true)}}
        onLogOutSuccessful={() => {setLoggedInUser(null)}}
      />
    <Container className={styles.NotesPage}>
      
      <>
        { loggedInUser
          ? <NotesPageLoggedInView/>
          : <NotesPageLoggedOutView/>
        }
      </>

      {showSignUpModal &&
        <SignUpModal
          onDismiss={() => {setShowSignUpModal(false)}}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUpModal(false);
          }}
        />
      }
      {showLogInModal &&
        <LogInModal
          onDismiss={() => {setShowLoginModal(false)}}
          onLogInSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLoginModal(false);
          }}
        />
      }

    </Container>
    </div>
  );
}

export default App;
