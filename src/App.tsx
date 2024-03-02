import { useState } from 'react'
import Login from "./components/Login.tsx";
import { observer } from "mobx-react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const App = observer(() => {
  const [auth, setAuth] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const mainButtonClick = () => {
    location.pathname === '/' ? navigate('/menu') : navigate('/');
  }

  return (
    <div className={'app-container'}>
      {auth ? (
        <Outlet />
      ) : (
        <Login setAuth={setAuth} />
      )}
      <div onClick={mainButtonClick} className={'main-btn'}></div>
    </div>
  );
});

export default App;

