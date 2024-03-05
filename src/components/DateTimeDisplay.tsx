import { useEffect, useState } from 'react';
import { store } from '../store/store.ts';

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  const year = currentDateTime.getFullYear();
  const month = formatTime(currentDateTime.getMonth() + 1);
  const day = formatTime(currentDateTime.getDate());
  const hours = formatTime(currentDateTime.getHours());
  const minutes = formatTime(currentDateTime.getMinutes());

  return (
    <div className={'date-container'}>
      <div>
        {year}-{month}-{day}
      </div>
      <div>{store.stateData.callStatus}</div>
      <div>
        {hours}:{minutes}
      </div>
    </div>
  );
};

export default DateTimeDisplay;
