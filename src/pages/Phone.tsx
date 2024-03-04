import {Flex} from "antd";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CallNumbers} from "../lib/enum.ts";
import Stopwatch from "../components/StopWatch.tsx";
import DateTimeDisplay from "../components/DateTimeDisplay.tsx";
import {store} from "../store/store.ts";
import {PhoneProps} from "../lib/interfaces.ts";
import {observer} from "mobx-react";

const Phone = observer(({ua, sipData}: PhoneProps) => {
  const [callStatus, setCallStatus] = useState('On Hook');
  const callSoundRef = React.useRef<HTMLAudioElement>(null);
  const failedSoundRef = React.useRef<HTMLAudioElement>(null);
  const callDuration = useRef('');

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !store.stateData.isCalling && store.stateData.number.length > 0) call();
    if (e.key ==='Escape' && store.stateData.isCalling) call();
    if (e.key === 'Backspace' && !store.stateData.isCalling) deleteNumber();
    if (isNaN(+e.key) || store.stateData.number.length === CallNumbers.MaxLength || store.stateData.isCalling) return;
    store.updateStateData({...store.stateData, number: store.stateData.number + e.key});
  }, [store.stateData.number, store.stateData.isCalling]);

  useEffect(() => {
     window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

  }, [handleKeyPress])

  const addNumber = (e:React.MouseEvent<HTMLDivElement>) => {
    if (store.stateData.number.length === CallNumbers.MaxLength || (e.target as HTMLDivElement).children.length || store.stateData.isCalling) return;
    store.updateStateData({...store.stateData, number: store.stateData.number + (e.target as HTMLDivElement).textContent});
  }

  const deleteNumber = () => {
    if (store.stateData.isCalling) return;
    store.updateStateData({...store.stateData, number: store.stateData.number.slice(0, store.stateData.number.length - 1)});
  }

  const addContact = () => {
    if (store.stateData.isCalling) return;
    store.updateStateData({...store.stateData, currentPage: 'contacts'});
  }

  function endCall() {
    console.log('end call called')
    ua?.terminateSessions();
    store.addNumber({number: store.stateData.number, duration: callDuration.current, type: 'outgoing'});
    store.updateStateData({...store.stateData, isStopWatchRunning: false});
    setCallStatus('Call ended');
    store.updateStateData({...store.stateData, number: ''});
    store.updateStateData({...store.stateData, isCalling: false});
    setTimeout(() => {
      setCallStatus('On Hook')
    }, 2000);
  }

  const playFailedSound = () => {
    failedSoundRef.current?.play();
    setTimeout(() => {
      failedSoundRef.current?.pause();
      if (failedSoundRef.current?.currentTime) {
        failedSoundRef.current.currentTime = 0;
      }
    }, 2500);
  }

  const stopCallSound = () => {
    callSoundRef.current?.pause();
    if (callSoundRef.current?.currentTime) {
      callSoundRef.current.currentTime = 0;
    }
  }

  function call() {
      if (store.stateData.number.length === 0) return;
    store.updateStateData({...store.stateData, isCalling: true});
      setCallStatus('Dealing...');
      // HTML5 <video> elements in which local and remote video will be shown
      const views = {
        'selfView':   document.getElementById('my-video'),
        'remoteView': document.getElementById('peer-video')
      };

      const eventHandlers = {
        progress:   function(data){
          console.log('progress', data)
          callSoundRef.current?.play();
        },
        failed:     function(data){
          console.log('failed', data);
          stopCallSound();
          playFailedSound();
          endCall();
        },
        confirmed:  function(data){
          console.log('confirmed', data);
          stopCallSound();
          setCallStatus('In-Call');
          store.updateStateData({...store.stateData, isStopWatchRunning: true});
        },
        ended:      function(data){
          console.log('ended', data);
          playFailedSound();
          endCall();
        }
      };

      const options = {
        'eventHandlers': eventHandlers,
        'extraHeaders': [ 'X-Foo: foo', 'X-Bar: bar' ],
        'mediaConstraints': {'audio': true, 'video': false},
      };

      ua?.call(`sip:${store.stateData.number}@${sipData.server}`, options);

    }


  return (
    <div className="display">
      <audio ref={callSoundRef} src={'/sounds/ringing.mp3'} loop={true} />
      <audio ref={failedSoundRef} src={'/sounds/failed.mp3'} />
      <div className={'display-area'}>
        <DateTimeDisplay/>
        <div className={'number-area'}>{store.stateData.number}</div>
        <Flex className={'stopwatch-area'}>
          <p>{callStatus}</p>
          {store.stateData.isStopWatchRunning && <Stopwatch callDuration={callDuration}/>}
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
          {store.stateData.isCalling ? (
            <div
              onClick={() => ua?.terminateSessions()}
              className={'ring-button end-button'}></div>

          ) : (
            <div
              onClick={call}
              className={'ring-button'}></div>
          )}
          <div onClick={deleteNumber} className={'delete-number'}></div>

        </Flex>

      </div>
    </div>
  );
});

export default Phone;
