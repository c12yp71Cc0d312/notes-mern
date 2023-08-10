import LogInModal from './components/LogInModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { useEffect, useState } from 'react';
import { User as UserModel } from './models/user';
import * as NotesApi from "./network/notes_api";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import NotesPage from './Pages/NotesPage';
import { Container } from 'react-bootstrap';
import PrivacyPage from './Pages/PrivacyPage';
import NotFoundPage from './Pages/NotFoundPage';
import styles from "./styles/App.module.css";

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
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onSignUpClicked={() => {setShowSignUpModal(true)}}
          onLogInClicked={() => {setShowLoginModal(true)}}
          onLogOutSuccessful={() => {setLoggedInUser(null)}}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route
              path="/privacy"
              element={<PrivacyPage />}
            />
            <Route
              path="/*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Container>

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
      </div>
    </BrowserRouter>
  );
}

export default App;
