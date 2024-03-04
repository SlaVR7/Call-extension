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
import {store} from "./store/store.ts";

const App = observer(() => {
  const [ua, setUa] = useState<UA | null>(null);
  const [sipData, setSipData] = useState<SipDataProps | null>(null);
  const [session, setSession] = useState();
  const currentPage = store.stateData.currentPage;

  function applySipData(sipData: SipDataProps) {
    console.log('RENDER')
    setSipData(sipData);
    const ua = register(sipData);
    setUa(ua);

    if (ua) {
      ua.on('connecting', () => {
        console.log('Подключение к серверу...');
      });

      ua.on('connected', () => {
        console.log('Соединение установлено');
      });

      ua.on('disconnected', (data) => {
        console.log('Соединение разорвано', data);
        store.updateStateData({...store.stateData, auth: false});
      });

      ua.on('registered', () => {
        console.log('Успешная авторизация');
        store.updateStateData({...store.stateData, auth: true});
      });

      ua.on('registrationFailed', (e) => {
        console.error('Ошибка авторизации', e);
        store.updateStateData({...store.stateData, isAuthError: true});
        setTimeout(() => {
          store.updateStateData({...store.stateData, isAuthError: false});
        }, 1000);
      });

      ua.on('unregistered', () => {
        console.log('Авторизация завершена');
        store.updateStateData({...store.stateData, auth: false});
      });

      ua.start();

      ua.on('newRTCSession', (data) => {
        const { originator, session, request } = data;

        if (originator === 'remote') {
          setSession(session);
          store.updateStateData({...store.stateData, isIncomingCall: true});
          const incomingNumber = session.remote_identity.uri.user;
          store.updateStateData({...store.stateData, number: incomingNumber});
          store.updateStateData({...store.stateData, currentPage: 'incoming'});
          // session.answer();
          // session.reject();
          console.log('Получен входящий вызов:', session);
          console.log('INVITE запрос:', request);
        }
      });
    }

  }

  const mainButtonClick = () => {
    if (store.stateData.isIncomingCall || store.stateData.isCalling || !store.stateData.auth) return;
    if (currentPage === 'phone') {
      store.updateStateData({...store.stateData, currentPage: 'menu'});
    } else store.updateStateData({...store.stateData, currentPage: 'phone'});
  }

  return (
    <div className={'app-container'}>
      {store.stateData.auth ? (
        <>
          {/* попробовать закинуть всё в mobx объектом со свойствами */}
          {currentPage === 'phone' && <Phone ua={ua} sipData={sipData} />}
          {currentPage === 'menu' && <Menu ua={ua} />}
          {currentPage === 'contacts' && <Contacts />}
          {currentPage === 'incoming' && <IncomingCall ua={ua} session={session} />}
          {currentPage === 'call-log' && <CallLog />}
        </>
      ) : (
        <Login applySipData={applySipData} />
      )}
      <div onClick={mainButtonClick} className={store.stateData.auth ? 'main-btn main-btn-anim' : 'main-btn'}></div>
    </div>
  );
});

export default App;

