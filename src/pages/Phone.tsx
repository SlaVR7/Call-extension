import {Flex} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {CallNumbers} from "../lib/enum.ts";
import Stopwatch from "../components/StopWatch.tsx";
import DateTimeDisplay from "../components/DateTimeDisplay.tsx";
import {store} from "../store/store.ts";
import {PhoneProps} from "../lib/interfaces.ts";

const Phone = ({number, setNumber, setPage, isCalling, setIsCalling}: PhoneProps) => {
  const [isStopWatchRunning, setIsStopWatchRunning] = useState(false);
  const [callDuration, setCallDuration] = useState('');
  let callLog = new URLSearchParams(location.search).get('number');
  const [callLogNumber, setCallLogNumber] = useState(callLog)
  const [callStatus, setCallStatus] = useState('On Hook');

  useEffect(() => {
    isCalling ? setCallStatus('Dealing...') : setCallStatus('On Hook');
  }, [isCalling])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isCalling && number.length > 0) callOrEnd();
    if (e.key ==='Escape' && isCalling) callOrEnd();
    if (e.key === 'Backspace' && !isCalling) deleteNumber();
    if (isNaN(+e.key) || number.length === CallNumbers.MaxLength || isCalling) return;
    setNumber(prevState => prevState + e.key);
  }, [number, isCalling]);

  useEffect(() => {
    if (callLogNumber) {
      setNumber(callLogNumber);
      setCallLogNumber(null);
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

  }, [handleKeyPress])

  const addNumber = (e:React.MouseEvent<HTMLDivElement>) => {
    if (number.length === CallNumbers.MaxLength || (e.target as HTMLDivElement).children.length || isCalling) return;
    setNumber(prevState => prevState + (e.target as HTMLDivElement).textContent)
  }

  const deleteNumber = () => {
    if (isCalling) return;
    setNumber(prevState => prevState.slice(0, prevState.length - 1))
  }

  const addContact = () => {
    if (isCalling) return;
    setPage('contacts');
  }

  function callOrEnd() {
    if (isCalling) {
      store.addNumber({number, duration: callDuration, type: 'outgoing'});
      setIsStopWatchRunning(false);
      setNumber('');
    } else {
      if (number.length === 0) return;
      setIsStopWatchRunning(true);
    }
    setIsCalling(prevState => !prevState);
  }

  return (
    <div className="display">
      <div className={'display-area'}>
        <DateTimeDisplay />
        <div className={'number-area'}>{number}</div>
        <Flex className={'stopwatch-area'}>
          <p>{callStatus}</p>
          {isStopWatchRunning && <Stopwatch setCallDuration={setCallDuration} />}
        </Flex>
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
          <div
            onClick={callOrEnd}
            className={isCalling ? 'ring-button end-button' : 'ring-button'}></div>
          <div onClick={deleteNumber} className={'delete-number'}></div>
        </Flex>

      </div>
    </div>
  );
};

export default Phone;
