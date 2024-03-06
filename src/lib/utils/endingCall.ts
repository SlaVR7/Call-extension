import { store } from '../../store/store.ts';
import { playFailedSound } from './sound.ts';
import React from 'react';
import { UA } from 'jssip';

export function remoteEndingCall(
  isFailed: boolean,
  incomingNumber: string,
  failedSoundRef: React.RefObject<HTMLAudioElement>,
) {
  store.updateStateData({ ...store.stateData, isIncomingCall: false });
  store.updateStateData({ ...store.stateData, isStopWatchRunning: false });
  store.updateStateData({ ...store.stateData, isCalling: false });
  store.updateStateData({ ...store.stateData, number: '' });
  store.updateStateData({ ...store.stateData, callStatus: 'Call ended' });
  store.updateStateData({ ...store.stateData, currentPage: 'main' });
  store.addNumber({
    date: new Date().toLocaleString(),
    number: incomingNumber,
    duration: store.stateData.callDuration,
    type: isFailed ? 'missed' : 'incoming',
  });
  localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  playFailedSound(failedSoundRef);
  store.updateStateData({ ...store.stateData, callDuration: '00:00:00' });
  setTimeout(() => {
    store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
  }, 2000);
}

export function endCall(ua: UA | null) {
  console.log('end call called');
  ua?.terminateSessions();
  store.addNumber({
    date: new Date().toLocaleString(),
    number: store.stateData.number,
    duration: store.stateData.callDuration,
    type: 'outgoing',
  });
  localStorage.setItem(store.sipData.login, JSON.stringify(store.callsAndContacts));
  store.updateStateData({ ...store.stateData, isStopWatchRunning: false });
  store.updateStateData({ ...store.stateData, callStatus: 'Call ended' });
  store.updateStateData({ ...store.stateData, number: '' });
  store.updateStateData({ ...store.stateData, isCalling: false });
  setTimeout(() => {
    store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
  }, 2000);
}
