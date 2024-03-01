import {FC, FormEvent, useState} from "react";
import {LoginProps} from "../lib/interfaces.ts";
import JsSIP from 'jssip';
//
const Login:FC<LoginProps> = ({setAuth}:LoginProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [port, setPort] = useState('');

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()

    try {
      // const socket = new JsSIP.WebSocketInterface(`wss://voip.uiscom.ru:9050/`);
      // const _ua = new JsSIP.UA({
      //   uri: "sip:0336445@voip.uiscom.ru:9050",
      //   password: 'id49rvgNRL',
      //   display_name: '0336445',
      //   sockets: [socket]
      // });
      //
      // // console.log(`Попытка установить соединение: wss://${server}${port ? ':' + port : ''}`);
      //
      // _ua.on('connecting', () => {
      //   console.log('Подключение к серверу...');
      // });
      //
      // _ua.on('connected', () => {
      //   console.log('Соединение установлено');
      // setAuth(true);
      // });
      //
      // _ua.on('disconnected', (data) => {
      //   console.log('Соединение разорвано', data);
      // });
      //
      // _ua.on('registered', () => {
      //   console.log('Успешная авторизация');
      // });
      //
      // _ua.on('registrationFailed', (e) => {
      //   console.error('Ошибка авторизации', e);
      // });
      //
      // _ua.on('unregistered', () => {
      //   console.log('Авторизация завершена');
      // });
      //
      // _ua.start();
    } catch (e) {
      console.log(e)
    }

  }



  return (
    <div className={'display'}>
      <h1>Please enter your SIP data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Login:</p>
          <input
            placeholder="Enter your login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </label>
        <label>
          <p>Password:</p>
          <input placeholder="Enter your password"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <p>Server:</p>
          <input placeholder="Enter your server"
                 type="text"
                 value={server}
                 onChange={(e) => setServer(e.target.value)}
          />
        </label>
        <label>
          <p>Port (optional):</p>
          <input placeholder="Enter your port"
                 type="text"
                 value={port}
                 onChange={(e) => setPort(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;


