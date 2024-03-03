import React from "react";
import {UA} from "jssip";

export interface LoginProps {
  applySipData: (arg0: SipDataProps) => void;
  isAuthError: boolean;
}

export interface StopWatchProps {
  setCallDuration: React.Dispatch<React.SetStateAction<string>>;
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
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  ua: UA | undefined;
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
  number: string;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  isCalling: boolean;
  setIsCalling: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IncomingProps {
  number: string;
}
