import {store} from "../store/store.ts";
import {Flex} from "antd";

const CallLog = () => {
  const calls = store.calls;
  const reversedCalls = [...calls].reverse();

  function toPhone(number: string) {
    store.updateStateData({...store.stateData, number})
    store.updateStateData({...store.stateData, currentPage: 'phone'});
  }

  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Call log</h1>
      <ul className={'calls-list'}>
        {reversedCalls.map((call, index) => {
          return (
            <li key={index} onClick={() => toPhone(call.number)} className={'calls-item'}>
              <div className={`calls-icon ${call.type}`}></div>
              <Flex vertical align={"end"}>
                <p className={'call-log-number'}>{call.number}</p>
                <p className={'call-log-duration'}>{call.duration}</p>
              </Flex>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default CallLog;
