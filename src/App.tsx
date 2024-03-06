import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Session } from './lib/interfaces.ts';
import { UA } from 'jssip';
import { store } from './store/store.ts';
import DateTimeDisplay from './components/DateTimeDisplay.tsx';
import { mainButtonClick } from './lib/utils/mainButtonClick.ts';
import { CallLog, Contacts, IncomingCall, Login, MainDisplay, Phone } from './pages';
import { handleKeyPress } from './lib/utils/phone/typingNumber.ts';
import { answer } from './lib/utils/phone/calling.ts';

const App = observer(() => {
  const [ua, setUa] = useState<UA | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const currentPage = store.stateData.currentPage;
  const callSoundRef = useRef<HTMLAudioElement>(null);
  const numbersSoundRef = useRef<HTMLAudioElement>(null);
  const buttonsSoundRef = useRef<HTMLAudioElement>(null);
  const failedSoundRef = useRef<HTMLAudioElement>(null);
  const ringtoneRef = useRef<HTMLAudioElement>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleKeyDown  = (e: KeyboardEvent) => {
    if (['main', 'phone'].includes(store.stateData.currentPage)) {
      if (store.stateData.currentPage === 'main')
        store.updateStateData({ ...store.stateData, currentPage: 'phone' });
      return handleKeyPress(e, numbersSoundRef, ua, buttonsSoundRef, callSoundRef, failedSoundRef);
    }
    if (store.stateData.currentPage === 'incoming') {
      if (e.key === 'Escape') ua?.terminateSessions();
      if (e.key === 'Enter') answer(session, voiceAudioRef, ringtoneRef);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={'app-container'}>
      <div className={'display'}>
        <DateTimeDisplay />
        <audio ref={voiceAudioRef} autoPlay />
        <audio ref={failedSoundRef} src={'/sounds/failed.mp3'} loop={true} />
        <audio ref={buttonsSoundRef} src={'/sounds/button.mp3'} />
        <audio ref={ringtoneRef} src={'/sounds/ringtone.mp3'} loop={true} />
        <audio ref={callSoundRef} src={'/sounds/ringing.mp3'} loop={true} />
        <audio ref={numbersSoundRef} src={'/sounds/numbers.mp3'} />
        {store.stateData.auth ? (
          <>
            {currentPage === 'main' && <MainDisplay ua={ua} buttonsSoundRef={buttonsSoundRef} />}
            {currentPage === 'phone' && (
              <Phone
                ua={ua}
                failedSoundRef={failedSoundRef}
                buttonsSoundRef={buttonsSoundRef}
                callSoundRef={callSoundRef}
                numbersSoundRef={numbersSoundRef}
              />
            )}
            {currentPage === 'contacts' && <Contacts buttonsSoundRef={buttonsSoundRef} />}
            {currentPage === 'incoming' && (
              <IncomingCall ua={ua} session={session} voiceAudioRef={voiceAudioRef} ringtoneRef={ringtoneRef} />
            )}
            {currentPage === 'call-log' && <CallLog buttonsSoundRef={buttonsSoundRef} />}
          </>
        ) : (
          <Login
            setUa={setUa}
            setSession={setSession}
            buttonSoundRef={buttonsSoundRef}
            failedSoundRef={failedSoundRef}
            voiceAudioRef={voiceAudioRef}
          />
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
