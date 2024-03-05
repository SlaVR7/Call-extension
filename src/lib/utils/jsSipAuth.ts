import JsSIP from 'jssip';
import { SipDataProps } from '../interfaces.ts';
import { store } from '../../store/store.ts';

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
