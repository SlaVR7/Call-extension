import React, { useEffect } from 'react';
import { store } from '../store/store.ts';
import Stopwatch from '../components/StopWatch.tsx';
import { Flex } from 'antd';
import { IncomingProps } from '../lib/interfaces.ts';
import { observer } from 'mobx-react';
import { getName } from '../lib/utils/findInStore.ts';

const IncomingCall = observer(({ ua, session }: IncomingProps) => {
  const callSoundRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    callSoundRef.current?.play();
  }, []);

  function answer() {
    stopCallSound();
    store.updateStateData({ ...store.stateData, isStopWatchRunning: true });
    store.updateStateData({ ...store.stateData, callStatus: 'In-Call' });
    session?.answer();
  }

  const stopCallSound = () => {
    callSoundRef.current?.pause();
    if (callSoundRef.current?.currentTime) {
      callSoundRef.current.currentTime = 0;
    }
  };

  return (
    <div className={'incoming-container'}>
      <audio ref={callSoundRef} src={'/sounds/ringtone.mp3'} loop={true} />
      <h1 className={'menu-title'}>Incoming call</h1>
      <div className={'incoming-data'}>
        <p>{store.stateData.number}</p>
        <p className={'calls-name'}>{getName(store.stateData.number)}</p>
      </div>
      {store.stateData.isStopWatchRunning ? (
        <>
          <Flex justify={'space-between'}>
            <p>Call duration:</p>
            <Stopwatch />
          </Flex>
          <div
            onClick={() => ua?.terminateSessions()}
            className={'ring-button end-button center'}
          ></div>
        </>
      ) : (
        <div className={'incoming-buttons'}>
          <div onClick={answer} className={'ring-button ring-button-animation'}></div>
          <div onClick={() => ua?.terminateSessions()} className={'ring-button end-button'}></div>
        </div>
      )}
    </div>
  );
});

export default IncomingCall;
