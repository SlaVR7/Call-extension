import React from 'react';

export function stopCallSound(callSoundRef: React.RefObject<HTMLAudioElement>) {
  callSoundRef.current?.pause();
  if (callSoundRef.current?.currentTime) {
    callSoundRef.current.currentTime = 0;
  }
}

export const playButtonsSound = (buttonsSoundRef: React.RefObject<HTMLAudioElement>) => {
  buttonsSoundRef.current?.pause();
  if (buttonsSoundRef.current?.currentTime) buttonsSoundRef.current.currentTime = 0;
  buttonsSoundRef.current?.play();
};

export const playFailedSound = (failedSoundRef: React.RefObject<HTMLAudioElement>) => {
  failedSoundRef.current?.play();
  setTimeout(() => {
    failedSoundRef.current?.pause();
    if (failedSoundRef.current?.currentTime) {
      failedSoundRef.current.currentTime = 0;
    }
  }, 2500);
};

export function playNumberClick(numbersSoundRef: React.RefObject<HTMLAudioElement>) {
  numbersSoundRef.current?.pause();
  if (numbersSoundRef.current?.currentTime) numbersSoundRef.current.currentTime = 0;
  numbersSoundRef.current?.play();
}
