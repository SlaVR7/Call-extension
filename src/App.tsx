import React, { useState } from 'react';
import Login from './pages/Login.tsx';
import { observer } from 'mobx-react';
import IncomingCall from './pages/IncomingCall.tsx';
import { register } from './lib/utils/jsSipAuth.ts';
import { NewRTCSessionData, Session, SipDataProps } from './lib/interfaces.ts';
import Phone from './pages/Phone.tsx';
import { UA } from 'jssip';
import Contacts from './pages/Contacts.tsx';
import CallLog from './pages/CallLog.tsx';
import { store } from './store/store.ts';
import MainDisplay from './pages/MainDisplay.tsx';
import DateTimeDisplay from './components/DateTimeDisplay.tsx';
import { remoteEndingCall } from './lib/utils/remoteEndingCall.ts';

const App = observer(() => {
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const currentPage = store.stateData.currentPage;
  const buttonsSoundRef = React.useRef<HTMLAudioElement>(null);
  const failedSoundRef = React.useRef<HTMLAudioElement>(null);

  const playFailedSound = () => {
    failedSoundRef.current?.play();
    setTimeout(() => {
      failedSoundRef.current?.pause();
      if (failedSoundRef.current?.currentTime) {
        failedSoundRef.current.currentTime = 0;
      }
    }, 2500);
  };

  const playButtonsSound = () => {
    buttonsSoundRef.current?.pause();
    if (buttonsSoundRef.current?.currentTime) buttonsSoundRef.current.currentTime = 0;
    buttonsSoundRef.current?.play();
  };

  function applySipData(sipData: SipDataProps) {
    playButtonsSound();
    store.updateSipData(sipData);
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
        store.updateStateData({ ...store.stateData, auth: false });
      });

      ua.on('registered', () => {
        console.log('Успешная авторизация');
        store.updateStateData({ ...store.stateData, auth: true, callStatus: 'On Hook' });
        if (!localStorage.getItem(sipData.login)) {
          localStorage.setItem(sipData.login, JSON.stringify({ contacts: [], callLog: [] }));
        } else {
          store.setCallsAndContacts(localStorage.getItem(sipData.login));
        }
      });

      ua.on('registrationFailed', (e) => {
        console.error('Ошибка авторизации', e);
        store.updateStateData({ ...store.stateData, isAuthError: true });
        setTimeout(() => {
          store.updateStateData({ ...store.stateData, isAuthError: false });
        }, 1000);
      });

      ua.on('unregistered', () => {
        console.log('Авторизация завершена');
        store.updateStateData({ ...store.stateData, auth: false });
      });

      ua.start();

      ua.on('newRTCSession', (data: NewRTCSessionData) => {
        const { originator, session } = data;

        if (originator === 'remote') {
          setSession(session);
          store.updateStateData({ ...store.stateData, isIncomingCall: true });
          const incomingNumber = session.remote_identity.uri.user;
          store.updateStateData({ ...store.stateData, number: incomingNumber });
          store.updateStateData({ ...store.stateData, callStatus: 'Incoming call...' });
          store.updateStateData({ ...store.stateData, currentPage: 'incoming' });

          session.on('failed', () => {
            console.log('Звонок завершен');
            remoteEndingCall(true, incomingNumber, playFailedSound);
          });
          session.on('ended', () => {
            console.log('endedDDDDD');
            remoteEndingCall(false, incomingNumber, playFailedSound);
          });
        }
      });
    }
  }

  const mainButtonClick = () => {
    if (store.stateData.isIncomingCall || store.stateData.isCalling || !store.stateData.auth)
      return;
    playButtonsSound();
    store.updateStateData({ ...store.stateData, number: '' });
    store.updateStateData({ ...store.stateData, currentPage: 'main' });
  };

  return (
    <div className={'app-container'}>
      <div className={'display'}>
        <DateTimeDisplay />
        <audio ref={failedSoundRef} src={'/sounds/failed.mp3'} loop={true} />
        <audio ref={buttonsSoundRef} src={'/sounds/button.mp3'} />
        {store.stateData.auth ? (
          <>
            {currentPage === 'main' && <MainDisplay ua={ua} playButtonsSound={playButtonsSound} />}
            {currentPage === 'phone' && (
              <Phone
                ua={ua}
                playFailedSound={playFailedSound}
                playButtonsSound={playButtonsSound}
              />
            )}
            {currentPage === 'contacts' && <Contacts playButtonsSound={playButtonsSound} />}
            {currentPage === 'incoming' && (
              <IncomingCall ua={ua} session={session} playFailedSound={playFailedSound} />
            )}
            {currentPage === 'call-log' && <CallLog playButtonsSound={playButtonsSound} />}
          </>
        ) : (
          <Login applySipData={applySipData} />
        )}
        <div
          onClick={mainButtonClick}
          className={store.stateData.auth ? 'main-btn main-btn-anim' : 'main-btn'}
        ></div>
      </div>
    </div>
  );
});

export default App;
