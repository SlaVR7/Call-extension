import JsSIP from './node_modules/jssip/lib/JsSIP.js';

const configuration = {
  uri: 'sip:0336445@voip.uiscom.ru',
  authorization_user: '0336444',
  password: 'PLg9b5SNx_',
  ws_servers: 'wss://voip.uiscom.ru:9050',
};

let ua;
let session;

function startCall() {
  ua = new JsSIP.UA(configuration);

  ua.on('connected', () => {
    // Make an outbound call
    const options = {
      mediaConstraints: { audio: true, video: false },
      pcConfig: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    };
    session = ua.call('sip:0336445@voip.uiscom.ru:9050', options);
  });

  ua.start();
}

function endCall() {
  if (session) {
    session.terminate();
  }
}
