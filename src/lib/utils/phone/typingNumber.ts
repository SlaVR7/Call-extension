import React from 'react';
import { store } from '../../../store/store.ts';
import { CallNumbers } from '../../enum.ts';
import { playButtonsSound, playNumberClick } from '../sound.ts';
import { call } from './calling.ts';
import { UA } from 'jssip';

export const addNumber = (e: React.MouseEvent<HTMLDivElement>, numbersSoundRef: React.RefObject<HTMLAudioElement>) => {
  if (
    store.stateData.number.length === CallNumbers.MaxLength ||
    (e.target as HTMLDivElement).children.length ||
    store.stateData.isCalling
  )
    return;
  playNumberClick(numbersSoundRef);
  store.updateStateData({
    ...store.stateData,
    number: store.stateData.number + (e.target as HTMLDivElement).textContent,
  });
};


export const addContact = (buttonsSoundRef: React.RefObject<HTMLAudioElement>) => {
  if (store.stateData.isCalling) return;
  playButtonsSound(buttonsSoundRef);
  store.updateStateData({ ...store.stateData, currentPage: 'contacts' });
};


export const deleteNumber = (numbersSoundRef: React.RefObject<HTMLAudioElement>) => {
  if (store.stateData.isCalling) return;
  playNumberClick(numbersSoundRef);
  store.updateStateData({
    ...store.stateData,
    number: store.stateData.number.slice(0, store.stateData.number.length - 1),
  });
};


export const handleKeyPress = (e: KeyboardEvent,
                                 numbersSoundRef: React.RefObject<HTMLAudioElement>,
                                 ua: UA | null,
                                 buttonsSoundRef: React.RefObject<HTMLAudioElement>,
                                 callSoundRef: React.RefObject<HTMLAudioElement>,
                                 failedSoundRef: React.RefObject<HTMLAudioElement>,
                                 ) => {
  if (e.key === 'Enter' && !store.stateData.isCalling && store.stateData.number.length > 0)
    call(ua, buttonsSoundRef, callSoundRef, failedSoundRef);
  if (e.key === 'Escape' && store.stateData.isCalling) call(ua, buttonsSoundRef, callSoundRef, failedSoundRef);
  if (e.key === 'Backspace' && !store.stateData.isCalling) deleteNumber(numbersSoundRef);
  if (
    isNaN(+e.key) ||
    store.stateData.number.length === CallNumbers.MaxLength ||
    store.stateData.isCalling
  )
    return;
  playNumberClick(numbersSoundRef);
  store.updateStateData({ ...store.stateData, number: store.stateData.number + e.key });
}
