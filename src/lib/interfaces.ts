import { UA } from 'jssip';
import { RTCSessionEventMap } from 'jssip/lib/RTCSession';
import React from 'react';

export interface LoginProps {
  setUa: React.Dispatch<React.SetStateAction<UA | null>>
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  buttonSoundRef: React.RefObject<HTMLAudioElement>;
  failedSoundRef: React.RefObject<HTMLAudioElement>;
}

export interface NewContactMenuProps {
  name: string;
  saveContact: () => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
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
  failedSoundRef: React.RefObject<HTMLAudioElement>;
  buttonsSoundRef: React.RefObject<HTMLAudioElement>;
}

export interface Session {
  remote_identity: {
    uri: {
      user: string;
    };
  };
  on: (arg0: keyof RTCSessionEventMap, arg1: () => void) => void;
  answer: () => void;
}

export interface SoundProps {
  buttonsSoundRef: React.RefObject<HTMLAudioElement>;
}

export interface MainDisplayProps {
  ua: UA | null;
  buttonsSoundRef: React.RefObject<HTMLAudioElement>;
}

export interface NewRTCSessionData {
  originator: string;
  session: Session;
}

export interface IncomingProps {
  ua: UA | null;
  session: Session | null;
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
}
