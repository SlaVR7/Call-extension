import { Flex } from 'antd';
import { useEffect } from 'react';
import Stopwatch from '../components/StopWatch.tsx';
import { store } from '../store/store.ts';
import { PhoneProps } from '../lib/interfaces.ts';
import { observer } from 'mobx-react';
import { getName } from '../lib/utils/findInStore.ts';
import { addContact, addNumber, deleteNumber } from '../lib/utils/phone/typingNumber.ts';
import { call } from '../lib/utils/phone/calling.ts';

const Phone = observer(
  ({ ua, failedSoundRef, buttonsSoundRef, callSoundRef, numbersSoundRef }: PhoneProps) => {
    useEffect(() => {
      if (store.stateData.number && store.stateData.callPossibility)
        call(ua, buttonsSoundRef, callSoundRef, failedSoundRef);
    }, [buttonsSoundRef, callSoundRef, failedSoundRef, ua]);

    return (
      <>
        <div className={'display-area'}>
          <div className={'number-area'}>{store.stateData.number}</div>
          <div className={'number-area-name'}>{getName(store.stateData.number)}</div>
          {store.stateData.isStopWatchRunning && (
            <Flex justify={'space-around'} align={'center'} className={'stopwatch-area'}>
              <p>Call duration:</p>
              <Stopwatch />
            </Flex>
          )}
        </div>
        <div className={'call-buttons'}>
          <div onClick={(e) => addNumber(e, numbersSoundRef)} className={'grid-container'}>
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
            <div onClick={() => addContact(buttonsSoundRef)} className={'add-contact'}></div>
            {store.stateData.isCalling ? (
              <div
                onClick={() => ua?.terminateSessions()}
                className={'ring-button end-button'}
              ></div>
            ) : (
              <div
                onClick={() => call(ua, buttonsSoundRef, callSoundRef, failedSoundRef)}
                className={'ring-button'}
              ></div>
            )}
            <div onClick={() => deleteNumber(numbersSoundRef)} className={'delete-number'}></div>
          </Flex>
        </div>
      </>
    );
  }
);

export default Phone;
