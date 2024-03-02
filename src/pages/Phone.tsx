import {Flex} from "antd";
import React, {useState} from "react";
import {CallNumbers} from "../lib/enum.ts";
import Stopwatch from "../components/StopWatch.tsx";
import DateTimeDisplay from "../components/DateTimeDisplay.tsx";

const Phone = () => {
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isStopWatchRunning, setIsStopWatchRunning] = useState(false);

  const addNumber = (e:React.MouseEvent<HTMLDivElement>) => {
    if (number.length === CallNumbers.MaxLength || (e.target as HTMLDivElement).children.length) return;
    setNumber(prevState => prevState + (e.target as HTMLDivElement).textContent)
  }

  const deleteNumber = () => {
    setNumber(prevState => prevState.slice(0, prevState.length - 1))
  }

  const callOrEnd = () => {
    if (isCalling) {
      setIsStopWatchRunning(false)
    } else {
      if (number.length === 0) return;
      setIsStopWatchRunning(true)
    }
    setIsCalling(prevState => !prevState);
  }

  return (
    <div className="display">
      <div className={'display-area'}>
        <DateTimeDisplay />
        <div className={'number-area'}>{number}</div>
        {isStopWatchRunning && <Stopwatch isStopWatchRunning={isStopWatchRunning} />}
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
          <div
            style={isCalling ? { backgroundImage: 'url("/public/images/ring-end.png")' } : {}}
            onClick={callOrEnd}
            className={'ring-button'}></div>
          <div onClick={deleteNumber} className={'delete-number'}></div>
        </Flex>

      </div>
    </div>
  );
};

export default Phone;
