import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Session } from './lib/interfaces.ts';
import { UA } from 'jssip';
import { store } from './store/store.ts';
import DateTimeDisplay from './components/DateTimeDisplay.tsx';
import { mainButtonClick } from './lib/utils/mainButtonClick.ts';
import { CallLog, Contacts, IncomingCall, Login, MainDisplay, Phone } from './pages';

const App = observer(() => {
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const currentPage = store.stateData.currentPage;
  const buttonsSoundRef = React.useRef<HTMLAudioElement>(null);
  const failedSoundRef = React.useRef<HTMLAudioElement>(null);

  return (
    <div className={'app-container'}>
      <div className={'display'}>
        <DateTimeDisplay />
        <audio ref={failedSoundRef} src={'/sounds/failed.mp3'} loop={true} />
        <audio ref={buttonsSoundRef} src={'/sounds/button.mp3'} />
        {store.stateData.auth ? (
          <>
            {currentPage === 'main' && <MainDisplay ua={ua} buttonsSoundRef={buttonsSoundRef} />}
            {currentPage === 'phone' && (
              <Phone
                ua={ua}
                failedSoundRef={failedSoundRef}
                buttonsSoundRef={buttonsSoundRef}
              />
            )}
            {currentPage === 'contacts' && <Contacts buttonsSoundRef={buttonsSoundRef} />}
            {currentPage === 'incoming' && (
              <IncomingCall ua={ua} session={session} />
            )}
            {currentPage === 'call-log' && <CallLog buttonsSoundRef={buttonsSoundRef} />}
          </>
        ) : (
          <Login setUa={setUa} setSession={setSession} buttonSoundRef={buttonsSoundRef} failedSoundRef={failedSoundRef} />
        )}
        <div
          onClick={() => mainButtonClick(buttonsSoundRef)}
          className={store.stateData.auth ? 'main-btn main-btn-anim' : 'main-btn'}
        ></div>
      </div>
    </div>
  );
});

export default App;
