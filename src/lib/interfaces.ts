import { UA } from 'jssip';
import { RTCSessionEventMap } from 'jssip/lib/RTCSession';

export interface LoginProps {
  applySipData: (arg0: SipDataProps) => void;
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
  playFailedSound: () => void;
  playButtonsSound: () => void;
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
  playButtonsSound: () => void;
}

export interface MainDisplayProps {
  ua: UA | null;
  playButtonsSound: () => void;
}

export interface NewRTCSessionData {
  originator: string;
  session: Session;
}

export interface IncomingProps {
  ua: UA | null;
  session: Session | null;
  playFailedSound: () => void;
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
