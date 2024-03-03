import {useState} from 'react'
import Login from "./pages/Login.tsx";
import { observer } from "mobx-react";
import IncomingCall from "./pages/IncomingCall.tsx";
import {register} from "./lib/utils/jsSipAuth.ts";
import {SipDataProps} from "./lib/interfaces.ts";
import Phone from "./pages/Phone.tsx";
import Menu from "./pages/Menu.tsx";
import {UA} from "jssip";
import Contacts from "./pages/Contacts.tsx";
import CallLog from "./pages/CallLog.tsx";

const App = observer(() => {
  const [auth, setAuth] = useState<boolean>(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [number, setNumber] = useState('');
  const [ua, setUa] = useState<UA | undefined>();

  const [currentPage, setCurrentPage] = useState('phone');

  function applySipData(sipData: SipDataProps) {
    console.log('RENDER')
    const ua = register(sipData, setIsAuthError);
    setUa(ua);

    if (ua) {
      ua.on('connecting', () => {
        console.log('Подключение к серверу...');
      });

      ua.on('connected', () => {
        console.log('Соединение установлено');
        setAuth(true);
      });

      ua.on('disconnected', (data) => {
        console.log('Соединение разорвано', data);
        setAuth(false);
      });

      ua.on('registered', () => {
        console.log('Успешная авторизация');
      });

      ua.on('registrationFailed', (e) => {
        console.error('Ошибка авторизации', e);
        setIsAuthError(true);
        setTimeout(() => {
          setIsAuthError(false);
        }, 1000);
      });

      ua.on('unregistered', () => {
        console.log('Авторизация завершена');
        setAuth(false);
      });

      ua.start();
    }

  }


  let incomingNumber = '+795564630'; // подставить от апи
  // Если сбрасывает чувак, передавать в IncomingCall это, чтобы завершить там звонок

  const mainButtonClick = () => {
    if (isIncomingCall || isCalling || !auth) return;
    if (currentPage === 'phone') {
      setCurrentPage('menu');
    } else setCurrentPage('phone');
  }

  return (
    <div className={'app-container'}>
      {auth ? (
        <>
          {currentPage === 'phone' && <Phone number={number}
                                             setNumber={setNumber}
                                             setPage={setCurrentPage}
                                             isCalling={isCalling}
                                             setIsCalling={setIsCalling}
          />}
          {currentPage === 'menu' && <Menu setCurrentPage={setCurrentPage} ua={ua} />}
          {currentPage === 'contacts' && <Contacts numberFromPhone={number} setNumberFromPhone={setNumber} setCurrentPage={setCurrentPage} />}
          {currentPage === 'incoming' && <IncomingCall number={number} />}
          {currentPage === 'call-log' && <CallLog setNumber={setNumber} setCurrentPage={setCurrentPage} />}
        </>
      ) : (
        <Login applySipData={applySipData} isAuthError={isAuthError} />
      )}
      <div onClick={mainButtonClick} className={auth ? 'main-btn main-btn-anim' : 'main-btn'}></div>
    </div>
  );
});

export default App;

