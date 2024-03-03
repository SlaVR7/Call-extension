import {store} from "../store/store.ts";
import {Flex} from "antd";
import {CallLogProps} from "../lib/interfaces.ts";

const CallLog = ({setNumber, setCurrentPage}: CallLogProps) => {
  const calls = store.calls;
  const reversedCalls = [...calls].reverse();

  function toPhone(number: string) {
    setNumber(number);
    setCurrentPage('phone');
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
                <p className={'calls-data'}>{call.number}</p>
                <p className={'calls-data'}>{call.duration}</p>
              </Flex>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default CallLog;
