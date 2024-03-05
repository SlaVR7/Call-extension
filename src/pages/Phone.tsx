import { Flex } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { CallNumbers } from '../lib/enum.ts';
import Stopwatch from '../components/StopWatch.tsx';
import { store } from '../store/store.ts';
import { PhoneProps } from '../lib/interfaces.ts';
import { observer } from 'mobx-react';
import { getName } from '../lib/utils/findInStore.ts';

const Phone = observer(({ ua, playFailedSound, playButtonsSound }: PhoneProps) => {
  const callSoundRef = React.useRef<HTMLAudioElement>(null);
  const numbersSoundRef = React.useRef<HTMLAudioElement>(null);

  function playNumberClick() {
    numbersSoundRef.current?.pause();
    if (numbersSoundRef.current?.currentTime) numbersSoundRef.current.currentTime = 0;
    numbersSoundRef.current?.play();
  }

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !store.stateData.isCalling && store.stateData.number.length > 0)
        call();
      if (e.key === 'Escape' && store.stateData.isCalling) call();
      if (e.key === 'Backspace' && !store.stateData.isCalling) deleteNumber();
      if (
        isNaN(+e.key) ||
        store.stateData.number.length === CallNumbers.MaxLength ||
        store.stateData.isCalling
      )
        return;
      playNumberClick();
      store.updateStateData({ ...store.stateData, number: store.stateData.number + e.key });
    },
    [store.stateData.number, store.stateData.isCalling]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const addNumber = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      store.stateData.number.length === CallNumbers.MaxLength ||
      (e.target as HTMLDivElement).children.length ||
      store.stateData.isCalling
    )
      return;
    playNumberClick();
    store.updateStateData({
      ...store.stateData,
      number: store.stateData.number + (e.target as HTMLDivElement).textContent,
    });
  };

  const deleteNumber = () => {
    if (store.stateData.isCalling) return;
    playNumberClick();
    store.updateStateData({
      ...store.stateData,
      number: store.stateData.number.slice(0, store.stateData.number.length - 1),
    });
  };

  const addContact = () => {
    if (store.stateData.isCalling) return;
    playButtonsSound();
    store.updateStateData({ ...store.stateData, currentPage: 'contacts' });
  };

  function endCall() {
    console.log('end call called');
    ua?.terminateSessions();
    store.addNumber({
      date: new Date().toLocaleString(),
      number: store.stateData.number,
      duration: store.stateData.callDuration,
      type: 'outgoing',
    });
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
    store.updateStateData({ ...store.stateData, isStopWatchRunning: false });
    store.updateStateData({ ...store.stateData, callStatus: 'Call ended' });
    store.updateStateData({ ...store.stateData, number: '' });
    store.updateStateData({ ...store.stateData, isCalling: false });
    setTimeout(() => {
      store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
    }, 2000);
  }

  const stopCallSound = () => {
    callSoundRef.current?.pause();
    if (callSoundRef.current?.currentTime) {
      callSoundRef.current.currentTime = 0;
    }
  };

  function call() {
    if (store.stateData.number.length === 0) return;
    playButtonsSound();
    store.updateStateData({ ...store.stateData, isCalling: true });
    store.updateStateData({ ...store.stateData, callStatus: 'Dealing...' });

    const eventHandlers = {
      progress: function () {
        console.log('progress');
        callSoundRef.current?.play();
      },
      failed: function () {
        console.log('failed');
        stopCallSound();
        playFailedSound();
        endCall();
      },
      confirmed: function () {
        console.log('confirmed');
        stopCallSound();
        store.updateStateData({ ...store.stateData, callStatus: 'In-Call' });
        store.updateStateData({ ...store.stateData, isStopWatchRunning: true });
      },
      ended: function () {
        console.log('ended');
        playFailedSound();
        endCall();
      },
    };

    const options = {
      eventHandlers: eventHandlers,
      extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
      mediaConstraints: { audio: true, video: false },
    };

    ua?.call(`sip:${store.stateData.number}@${store.sipData.server}`, options);
  }

  return (
    <>
      <audio ref={callSoundRef} src={'/sounds/ringing.mp3'} loop={true} />
      <audio ref={numbersSoundRef} src={'/sounds/numbers.mp3'} />
      <div className={'display-area'}>
        <div className={'number-area'}>{store.stateData.number}</div>
        <div className={'number-area-name'}>{getName(store.stateData.number)}</div>
        {store.stateData.isStopWatchRunning &&
          <Flex justify={'space-around'} align={'center'} className={'stopwatch-area'}>
            <p>Call duration:</p>
            <Stopwatch />
        </Flex>
        }
      </div>
      <div className={'call-buttons'}>
        <div onClick={addNumber} className={'grid-container'}>
          <div className="grid-item">1</div>
          <div className="grid-item">2</div>
          <div className="grid-item">3</div>
          <div className="grid-item">4</div>
          <div className="grid-item">5</div>
          <div className="grid-item">6</div>
          <div className="grid-item">7</div>
          <div className="grid-item">8</div>
          <div className="grid-item">9</div>
          <div className="grid-item">*</div>
          <div className="grid-item">0</div>
          <div className="grid-item">#</div>
        </div>
        <Flex className={'bottom-buttons'}>
          <div onClick={addContact} className={'add-contact'}></div>
          {store.stateData.isCalling ? (
            <div onClick={() => ua?.terminateSessions()} className={'ring-button end-button'}></div>
          ) : (
            <div onClick={call} className={'ring-button'}></div>
          )}
          <div onClick={deleteNumber} className={'delete-number'}></div>
        </Flex>
      </div>
    </>
  );
});

export default Phone;
