import {Flex} from "antd";
import React, {useState} from "react";
import {CallNumbers} from "../lib/enum.ts";

const Phone = () => {
  const [number, setNumber] = useState('');

  const addNumber = (e:React.MouseEvent<HTMLDivElement>) => {
    if (number.length === CallNumbers.MaxLength) return;
    setNumber(prevState => prevState + (e.target as HTMLDivElement).textContent)
  }

  const deleteNumber = () => {
    setNumber(prevState => prevState.slice(0, prevState.length - 1))
  }

  return (
    <div className="display">
      <div className={'number-area'}>
        {number}
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
          <div className={'ring-button'}></div>
          <div onClick={deleteNumber} className={'delete-number'}></div>
        </Flex>

      </div>
    </div>
  );
};

export default Phone;
