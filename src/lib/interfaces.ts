import React, {MutableRefObject} from "react";
import {UA} from "jssip";

export interface LoginProps {
  applySipData: (arg0: SipDataProps) => void;
}

export interface StopWatchProps {
  callDuration: MutableRefObject<string>;
}

export interface CallStoreProps {
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

export interface PagesProps {
  ua: UA | null;
}

export interface CallLogProps {
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export interface ContactsProps {
  numberFromPhone: string;
  setNumberFromPhone: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export interface PhoneProps {
  ua:UA | null;
  sipData: SipDataProps | null;
}

export interface IncomingProps {
  ua: UA | null;
}

export interface IStateData {
  currentPage: string;
  auth: boolean;
  isAuthError: boolean;
  isIncomingCall: boolean;
  isCalling: boolean;
  number: string;
  isStopWatchRunning: boolean;
}
