import { store } from '../../../store/store.ts';
import { playFailedSound } from '../sound.ts';
import React from 'react';
import { UA } from 'jssip';

export function remoteEndingCall(
  isFailed: boolean,
  incomingNumber: string,
  failedSoundRef: React.RefObject<HTMLAudioElement>
) {
  store.updateStateData({
    ...store.stateData,
    isIncomingCall: false,
    isStopWatchRunning: false,
    isCalling: false,
    number: '',
    callStatus: 'Call ended',
    currentPage: 'main',
    callDuration: '00:00:00',
  });
  store.addNumber({
    date: new Date().toLocaleString(),
    number: incomingNumber,
    duration: store.stateData.callDuration,
    type: isFailed ? 'missed' : 'incoming',
  });
  localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  playFailedSound(failedSoundRef);
  setTimeout(() => {
    store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
  }, 2000);
}

export function endCall(ua: UA | null) {
  ua?.terminateSessions();
  store.addNumber({
    date: new Date().toLocaleString(),
    number: store.stateData.number,
    duration: store.stateData.callDuration,
    type: 'outgoing',
  });
  localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  store.updateStateData({
    ...store.stateData,
    isStopWatchRunning: false,
    callStatus: 'Call ended',
    number: '',
    isCalling: false,
  });
  setTimeout(() => {
    store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
  }, 2000);
}
