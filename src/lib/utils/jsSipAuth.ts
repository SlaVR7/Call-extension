import JsSIP, { UA } from 'jssip';
import { NewRTCSessionData, Session, SipDataProps } from '../interfaces.ts';
import { store } from '../../store/store.ts';
import { playButtonsSound } from './sound.ts';
import { remoteEndingCall } from './phone/endingCall.ts';
import { Dispatch, RefObject, SetStateAction } from 'react';

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

export function applySipData(
  sipData: SipDataProps,
  setUa: Dispatch<SetStateAction<UA | null>>,
  setSession: Dispatch<SetStateAction<Session | null>>,
  buttonsSoundRef: RefObject<HTMLAudioElement>,
  failedSoundRef: RefObject<HTMLAudioElement>,
  voiceAudioRef: RefObject<HTMLAudioElement>
) {
  playButtonsSound(buttonsSoundRef);
  store.updateSipData(sipData);
  const ua = register(sipData);
  setUa(ua);
  if (ua) {
    ua.on('disconnected', () => {
      store.updateStateData({ ...store.stateData, auth: false });
    });

    ua.on('registered', () => {
      store.updateStateData({
        ...store.stateData,
        auth: true,
        callStatus: 'On Hook',
        currentPage: 'main',
      });
      if (!localStorage.getItem(sipData.login)) {
        store.clearContacts();
        store.clearCallLog();
        localStorage.setItem(sipData.login, JSON.stringify({ contacts: [], callLog: [] }));
      } else {
        store.setCallsAndContacts(localStorage.getItem(sipData.login));
      }
    });

    ua.on('registrationFailed', () => {
      store.updateStateData({ ...store.stateData, isAuthError: true });
      setTimeout(() => {
        store.updateStateData({ ...store.stateData, isAuthError: false });
      }, 1000);
    });

    ua.on('unregistered', () => {
      store.updateStateData({ ...store.stateData, auth: false });
    });

    ua.start();

    ua.on('newRTCSession', (data: NewRTCSessionData) => {
      const { originator, session } = data;

      if (originator === 'remote') {
        setSession(session);
        const incomingNumber = session.remote_identity.uri.user;
        store.updateStateData({
          ...store.stateData,
          isIncomingCall: true,
          number: incomingNumber,
          callStatus: 'Incoming call...',
          currentPage: 'incoming',
        });

        session.on('failed', () => {
          remoteEndingCall(true, incomingNumber, failedSoundRef);
        });

        session.on('ended', () => {
          remoteEndingCall(false, incomingNumber, failedSoundRef);
        });

        session.on('confirmed', () => {
          store.updateStateData({
            ...store.stateData,
            isStopWatchRunning: true,
            callStatus: 'In-Call',
          });
        });
      }

      if (session.connection) {
        session.connection.addEventListener('track', function (e) {
          if (e.streams && e.streams[0] && voiceAudioRef.current) {
            voiceAudioRef.current.srcObject = e.streams[0];
          }
        });
      }
    });
  }
}
