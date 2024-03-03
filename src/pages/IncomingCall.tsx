import { useState} from 'react';
import {store} from "../store/store.ts";
import Stopwatch from "../components/StopWatch.tsx";
import {Flex} from "antd";
import {IncomingProps} from "../lib/interfaces.ts";

const IncomingCall = ({number}: IncomingProps) => {
  const [isStopWatchRunning, setIsStopWatchRunning] = useState(false);
  const [callDuration, setCallDuration] = useState('');

  // useEffect(() => {
  //   if (isCallFinished) endCall();
  // }, [isCallFinished])

  function answer() {
    // функция ответа
    setIsStopWatchRunning(true);


  }

  function endCall() {
    // функция окончания
    store.addNumber({number, duration: callDuration, type: 'incoming'});
    setIsStopWatchRunning(false);
  }

  return (
    <div className={'display incoming-container'}>
      <h1 className={'menu-title'}>Incoming call</h1>
      <div className={'incoming-data'}>
        <p>{number}</p>
        <p>name</p>
      </div>
      {isStopWatchRunning ? (
        <>
          <Flex justify={"space-between"}>
            <p>In-Call</p>
            <Stopwatch setCallDuration={setCallDuration}/>
          </Flex>
          <div onClick={endCall} className={'ring-button end-button center'}></div>
        </>
        )
        : (
        <div className={'incoming-buttons'}>
          <div onClick={answer} className={'ring-button ring-button-animation'}></div>
          <div className={'ring-button end-button'}></div>
        </div>
      )}
    </div>
  );
};

export default IncomingCall;
