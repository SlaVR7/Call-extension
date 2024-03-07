import { UA } from 'jssip';
import { RTCSessionEventMap } from 'jssip/lib/RTCSession';
import React, { Dispatch, RefObject, SetStateAction } from 'react';

export interface LoginProps {
  setUa: Dispatch<SetStateAction<UA | null>>;
  setSession: Dispatch<SetStateAction<Session | null>>;
  buttonSoundRef: RefObject<HTMLAudioElement>;
  failedSoundRef: RefObject<HTMLAudioElement>;
  voiceAudioRef: RefObject<HTMLAudioElement>;
}

export interface NewContactMenuProps {
  name: string;
  saveContact: () => void;
  setName: Dispatch<SetStateAction<string>>;
  number: string;
  setNumber: Dispatch<SetStateAction<string>>;
  cancel: () => void;
}

export interface ContactsListProps {
  call: (arg0: string) => void;
  sortedContacts: ContactProps[];
  deleteContact: (contact: ContactProps, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface CallStoreProps {
  date: string;
  number: string;
  duration: string;
  type: string;
}

export interface ContactProps {
  name: string;
  number: string;
}

export interface SipDataProps {
  server: string;
  login: string;
  password: string;
  port: string;
}

export interface PhoneProps {
  ua: UA | null;
  failedSoundRef: RefObject<HTMLAudioElement>;
  buttonsSoundRef: RefObject<HTMLAudioElement>;
  numbersSoundRef: RefObject<HTMLAudioElement>;
}

export interface Session {
  connection: {
    addEventListener: (arg0: string, arg1: (e: {streams: MediaProvider[] | null[]}) => void) => void;
  };
  remote_identity: {
    uri: {
      user: string;
    };
  };
  on: (arg0: keyof RTCSessionEventMap, arg1: () => void) => void;
  answer: () => void;
}

export interface SoundProps {
  buttonsSoundRef: RefObject<HTMLAudioElement>;
}

export interface MainDisplayProps {
  ua: UA | null;
  buttonsSoundRef: RefObject<HTMLAudioElement>;
}

export interface NewRTCSessionData {
  originator: string;
  session: Session;
}

export interface IncomingProps {
  ua: UA | null;
  session: Session | null;
  voiceAudioRef: RefObject<HTMLAudioElement>;
  ringtoneRef: RefObject<HTMLAudioElement>;
}

export interface IStateData {
  currentPage: string;
  auth: boolean;
  isAuthError: boolean;
  isIncomingCall: boolean;
  isCalling: boolean;
  number: string;
  isStopWatchRunning: boolean;
  callStatus: string;
  callDuration: string;
  callPossibility: boolean;
}
