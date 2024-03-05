import { useEffect, useState } from 'react';
import { store } from '../store/store.ts';

const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const callDuration = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    store.updateStateData({ ...store.stateData, callDuration });
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

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className={'stopwatch'}>
      {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
};

export default Stopwatch;
