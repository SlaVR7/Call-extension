import { RefObject } from 'react';

export function stopSound(soundRef: RefObject<HTMLAudioElement>) {
  soundRef.current?.pause();
  if (soundRef.current?.currentTime) {
    soundRef.current.currentTime = 0;
  }
}

export const playButtonsSound = (buttonsSoundRef: RefObject<HTMLAudioElement>) => {
  buttonsSoundRef.current?.pause();
  if (buttonsSoundRef.current?.currentTime) buttonsSoundRef.current.currentTime = 0;
  buttonsSoundRef.current?.play();
};

export const playFailedSound = (failedSoundRef: RefObject<HTMLAudioElement>) => {
  failedSoundRef.current?.play();
  setTimeout(() => {
    failedSoundRef.current?.pause();
    if (failedSoundRef.current?.currentTime) {
      failedSoundRef.current.currentTime = 0;
    }
  }, 2500);
};

export function playNumberClick(numbersSoundRef: RefObject<HTMLAudioElement>) {
  numbersSoundRef.current?.pause();
  if (numbersSoundRef.current?.currentTime) numbersSoundRef.current.currentTime = 0;
  numbersSoundRef.current?.play();
}
