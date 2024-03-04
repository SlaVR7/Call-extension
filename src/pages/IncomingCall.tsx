import React, {useEffect, useRef} from 'react';
import {store} from "../store/store.ts";
import Stopwatch from "../components/StopWatch.tsx";
import {Flex} from "antd";
import {IncomingProps} from "../lib/interfaces.ts";

const IncomingCall = ({ua, session}: IncomingProps) => {
  const callSoundRef = React.useRef<HTMLAudioElement>(null);
  const callDuration = useRef('');

  useEffect(() => {
    callSoundRef.current?.play();
  }, []);

  function answer() {
    stopCallSound();
    store.updateStateData({...store.stateData, isStopWatchRunning: true});
    session.answer();

  }

  function reject() {
    stopCallSound();
    ua?.terminateSessions();
    store.addNumber({number: store.stateData.number, duration: '00:00:00', type: 'missed'});
    store.updateStateData({...store.stateData, number: ''});
    store.updateStateData({...store.stateData, isIncomingCall: false});
    store.updateStateData({...store.stateData, currentPage: 'phone'});
  }

  function endCall() {
    ua?.terminateSessions();
    stopCallSound();
    store.addNumber({number: store.stateData.number, duration: callDuration.current, type: 'incoming'});
    store.updateStateData({...store.stateData, isStopWatchRunning: false});
  }

  const stopCallSound = () => {
    callSoundRef.current?.pause();
    if (callSoundRef.current?.currentTime) {
      callSoundRef.current.currentTime = 0;
    }
  }

  return (
    <div className={'display incoming-container'}>
      <audio ref={callSoundRef} src={'/sounds/ringtone.mp3'} loop={true}/>
      <h1 className={'menu-title'}>Incoming call</h1>
      <div className={'incoming-data'}>
        <p>{store.stateData.number}</p>
        <p>name</p>
      </div>
      {store.stateData.isStopWatchRunning ? (
          <>
            <Flex justify={"space-between"}>
              <p>In-Call</p>
              <Stopwatch callDuration={callDuration}/>
            </Flex>
            <div onClick={endCall} className={'ring-button end-button center'}></div>
          </>
        )
        : (
          <div className={'incoming-buttons'}>
            <div onClick={answer} className={'ring-button ring-button-animation'}></div>
            <div onClick={reject} className={'ring-button end-button'}></div>
          </div>
        )}
    </div>
  );
};

export default IncomingCall;
