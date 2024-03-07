import { useEffect } from 'react';
import { store } from '../store/store.ts';
import Stopwatch from '../components/StopWatch.tsx';
import { Flex } from 'antd';
import { IncomingProps } from '../lib/interfaces.ts';
import { observer } from 'mobx-react';
import { getName } from '../lib/utils/findInStore.ts';
import { answer } from '../lib/utils/phone/calling.ts';
import { stopSound } from '../lib/utils/sound.ts';

const IncomingCall = observer(({ ua, session, voiceAudioRef, ringtoneRef }: IncomingProps) => {
  useEffect(() => {
    ringtoneRef.current?.play();

    return () => {
      stopSound(ringtoneRef);
    }
  }, []);

  return (
    <div className={'incoming-container'}>
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
          <div onClick={() => answer(session, voiceAudioRef, ringtoneRef)} className={'ring-button ring-button-animation'}></div>
          <div onClick={() => ua?.terminateSessions()} className={'ring-button end-button'}></div>
        </div>
      )}
    </div>
  );
});

export default IncomingCall;
