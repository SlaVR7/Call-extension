import { store } from '../../../store/store.ts';
import { playButtonsSound, playFailedSound, stopCallSound } from '../sound.ts';
import { endCall } from '../endingCall.ts';
import { UA } from 'jssip';
import React from 'react';

export function call(ua: UA | null,
                     buttonsSoundRef: React.RefObject<HTMLAudioElement>,
                     callSoundRef: React.RefObject<HTMLAudioElement>,
                     failedSoundRef: React.RefObject<HTMLAudioElement>,
) {
  if (store.stateData.number.length === 0) return;
  playButtonsSound(buttonsSoundRef);
  store.updateStateData({ ...store.stateData, isCalling: true });
  store.updateStateData({ ...store.stateData, callStatus: 'Dealing...' });

  const eventHandlers = {
    progress: function () {
      console.log('progress');
      callSoundRef.current?.play();
    },
    failed: function () {
      console.log('failed');
      stopCallSound(callSoundRef);
      playFailedSound(failedSoundRef);
      endCall(ua);
    },
    confirmed: function () {
      console.log('confirmed');
      stopCallSound(callSoundRef);
      store.updateStateData({ ...store.stateData, callStatus: 'In-Call' });
      store.updateStateData({ ...store.stateData, isStopWatchRunning: true });
    },
    ended: function () {
      console.log('ended');
      playFailedSound(failedSoundRef);
      endCall(ua);
    },
  };

  const options = {
    eventHandlers: eventHandlers,
    extraHeaders: ['X-Foo: foo', 'X-Bar: bar'],
    mediaConstraints: { audio: true, video: false },
  };

  ua?.call(`sip:${store.stateData.number}@${store.sipData.server}`, options);
}
