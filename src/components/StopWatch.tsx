import {useEffect, useState} from "react";
import {StopWatchProps} from "../lib/interfaces.ts";

const Stopwatch = ({setCallDuration}: StopWatchProps) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    setCallDuration(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
    const tick = () => {
      setSeconds((prevSeconds) => (prevSeconds + 1) % 60);

      if (seconds === 59) {
        setMinutes((prevMinutes) => (prevMinutes + 1) % 60);

        if (minutes === 59) {
          setHours((prevHours) => prevHours + 1);
        }
      }
    };

    let interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes, hours]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className={'stopwatch'}>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</div>
  );
};

export default Stopwatch;
