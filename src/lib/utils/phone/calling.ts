import { store } from '../../../store/store.ts';
import { playButtonsSound, playFailedSound, stopSound } from '../sound.ts';
import { endCall } from './endingCall.ts';
import { UA } from 'jssip';
import { RefObject } from 'react';
import { Session } from '../../interfaces.ts';

export function answer(session: Session | null, voiceAudioRef: RefObject<HTMLAudioElement>, ringtoneSoundRef: RefObject<HTMLAudioElement>) {
  stopSound(ringtoneSoundRef);
  session?.answer();

  if (session?.connection) {
    session.connection.addEventListener('track', function (e) {
      if (e.streams && e.streams[0] && voiceAudioRef.current) {
        voiceAudioRef.current.srcObject = e.streams[0];
      }
    });
  }
}

export function call(
  ua: UA | null,
  buttonsSoundRef: RefObject<HTMLAudioElement>,
  failedSoundRef: RefObject<HTMLAudioElement>
) {
  if (store.stateData.number.length === 0) return;
  playButtonsSound(buttonsSoundRef);
  store.updateStateData({ ...store.stateData, isCalling: true, callStatus: 'Dealing...' });

  const eventHandlers = {
    failed: function () {
      playFailedSound(failedSoundRef);
      endCall(ua);
    },
    confirmed: function () {
      store.updateStateData({
        ...store.stateData,
        callStatus: 'In-Call',
        isStopWatchRunning: true,
      });
    },
    ended: function () {
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
