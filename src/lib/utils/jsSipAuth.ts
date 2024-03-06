import JsSIP, { UA } from 'jssip';
import { NewRTCSessionData, Session, SipDataProps } from '../interfaces.ts';
import { store } from '../../store/store.ts';
import { playButtonsSound } from './sound.ts';
import { remoteEndingCall } from './endingCall.ts';
import React from 'react';

export const register = (sipData: SipDataProps) => {
  const { server, login, password, port } = sipData;
  try {
    const socket = new JsSIP.WebSocketInterface(`wss:/${server}`);
    return new JsSIP.UA({
      uri: `sip:${login}@${server}:${port}`,
      password: password,
      display_name: login,
      sockets: [socket],
    });
  } catch (e) {
    console.log(e);
    store.updateStateData({ ...store.stateData, isAuthError: true });
    setTimeout(() => {
      store.updateStateData({ ...store.stateData, isAuthError: false });
    }, 1000);
  }
  return null;
};

export function applySipData(sipData: SipDataProps,
                             setUa: React.Dispatch<React.SetStateAction<UA | null>>,
                             setSession: React.Dispatch<React.SetStateAction<Session | null>>,
                            buttonsSoundRef: React.RefObject<HTMLAudioElement>,
                            failedSoundRef: React.RefObject<HTMLAudioElement>,
) {
  playButtonsSound(buttonsSoundRef);
  store.updateSipData(sipData);
  const ua = register(sipData);
  setUa(ua);
  if (ua) {
    ua.on('connecting', () => {
      console.log('Подключение к серверу...');
    });

    ua.on('connected', () => {
      console.log('Соединение установлено');
    });

    ua.on('disconnected', (data) => {
      console.log('Соединение разорвано', data);
      store.updateStateData({ ...store.stateData, auth: false });
    });

    ua.on('registered', () => {
      console.log('Успешная авторизация');
      store.updateStateData({ ...store.stateData, auth: true, callStatus: 'On Hook' });
      if (!localStorage.getItem(sipData.login)) {
        localStorage.setItem(sipData.login, JSON.stringify({ contacts: [], callLog: [] }));
      } else {
        store.setCallsAndContacts(localStorage.getItem(sipData.login));
      }
    });

    ua.on('registrationFailed', (e) => {
      console.error('Ошибка авторизации', e);
      store.updateStateData({ ...store.stateData, isAuthError: true });
      setTimeout(() => {
        store.updateStateData({ ...store.stateData, isAuthError: false });
      }, 1000);
    });

    ua.on('unregistered', () => {
      console.log('Авторизация завершена');
      store.updateStateData({ ...store.stateData, auth: false });
    });

    ua.start();

    ua.on('newRTCSession', (data: NewRTCSessionData) => {
      const { originator, session } = data;

      if (originator === 'remote') {
        setSession(session);
        store.updateStateData({ ...store.stateData, isIncomingCall: true });
        const incomingNumber = session.remote_identity.uri.user;
        store.updateStateData({ ...store.stateData, number: incomingNumber });
        store.updateStateData({ ...store.stateData, callStatus: 'Incoming call...' });
        store.updateStateData({ ...store.stateData, currentPage: 'incoming' });

        session.on('failed', () => {
          console.log('Звонок завершен');
          remoteEndingCall(true, incomingNumber, failedSoundRef);
        });
        session.on('ended', () => {
          console.log('endedDDDDD');
          remoteEndingCall(false, incomingNumber, failedSoundRef);
        });
      }
    });
  }
}
