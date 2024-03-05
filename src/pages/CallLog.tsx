import { store } from '../store/store.ts';
import { Flex } from 'antd';
import { getName } from '../lib/utils/findInStore.ts';
import { observer } from 'mobx-react';
import { SoundProps } from '../lib/interfaces.ts';

const CallLog = observer(({ playButtonsSound }: SoundProps) => {
  const calls = store.callsAndContacts.calls;
  const reversedCalls = [...calls].reverse();

  function toPhone(number: string) {
    playButtonsSound();
    store.updateStateData({ ...store.stateData, number });
    store.updateStateData({ ...store.stateData, currentPage: 'phone' });
  }

  function clear() {
    playButtonsSound();
    store.clearCallLog();
    localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  }

  return (
    <>
      <h1 className={'menu-title'}>Call log</h1>
      <ul className={'calls-list'}>
        {reversedCalls.map((call, index) => {
          return (
            <li key={index} onClick={() => toPhone(call.number)} className={'calls-item'}>
              <div className={`calls-icon ${call.type}`}></div>
              <Flex vertical align={'end'}>
                <p className={'calls-name'}>{getName(call.number)}</p>
                <p className={'calls-number'}>{call.number}</p>
                <p className={'call-log-duration'}>{call.duration}</p>
                <p className={'call-log-date'}>{call.date}</p>
              </Flex>
            </li>
          );
        })}
      </ul>
      <button onClick={clear} className={'new-contact-button'}>
        Clear
      </button>
    </>
  );
});

export default CallLog;
