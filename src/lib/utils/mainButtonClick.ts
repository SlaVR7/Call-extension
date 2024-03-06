import { store } from '../../store/store.ts';
import { playButtonsSound } from './sound.ts';
import React from 'react';

export function mainButtonClick(buttonsSoundRef: React.RefObject<HTMLAudioElement>) {
  if (store.stateData.isIncomingCall || store.stateData.isCalling || !store.stateData.auth) return;
  playButtonsSound(buttonsSoundRef);
  store.updateStateData({ ...store.stateData, number: '', currentPage: 'main' });
}
