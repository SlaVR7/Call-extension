import { store } from '../../store/store.ts';

export function remoteEndingCall(
  isFailed: boolean,
  incomingNumber: string,
  playFailedSound: () => void
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
  playFailedSound();
  store.updateStateData({ ...store.stateData, callDuration: '00:00:00' });
  setTimeout(() => {
    store.updateStateData({ ...store.stateData, callStatus: 'On Hook' });
  }, 2000);
}
