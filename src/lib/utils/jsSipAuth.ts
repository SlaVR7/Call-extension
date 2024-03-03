import JsSIP from "jssip";
import {SipDataProps} from "../interfaces.ts";
import React from "react";

export const register = (sipData: SipDataProps, setIsAuthError: React.Dispatch<React.SetStateAction<boolean>>) => {
  const {server, login, password, port} = sipData;
  try {
    const socket = new JsSIP.WebSocketInterface(`wss:/${server}`);
    return new JsSIP.UA({
      uri: `sip:${login}@${server}:${port}`,
      password: password,
      display_name: login,
      sockets: [socket]
    });

  } catch (e) {
    console.log(e);
    setIsAuthError(true);
    setTimeout(() => {
      setIsAuthError(false);
    }, 1000);
  }
}
