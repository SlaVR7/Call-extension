import { FC, useEffect, useState } from 'react';
import { LoginProps } from '../lib/interfaces.ts';
import { Button, Input, notification } from 'antd';
import { store } from '../store/store.ts';
import { applySipData } from '../lib/utils/jsSipAuth.ts';
import { observer } from 'mobx-react';

const Login: FC<LoginProps> = observer(
  ({ setUa, setSession, buttonSoundRef, failedSoundRef, voiceAudioRef }) => {
    const [api, contextHolder] = notification.useNotification();
    const [login, setLogin] = useState('0336445');
    const [password, setPassword] = useState('id49rvgNRL');
    const [server, setServer] = useState('voip.uiscom.ru');
    const [port, setPort] = useState('9050');

    const openNotification = () => {
      api.error({
        message: `Authorization error!`,
        description: 'Please check the entered data',
        placement: 'top',
      });
    };

    useEffect(() => {
      if (store.stateData.isAuthError) openNotification();
    }, [store.stateData.isAuthError]);

    return (
      <>
        <h1 className={'menu-title'}>Enter your SIP data</h1>
        <form className={'new-contact-form'}>
          {contextHolder}
          <label>
            <p>Login:</p>
            <Input
              className={'new-contact-input'}
              placeholder="Enter your login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label>
            <p>Password:</p>
            <Input
              placeholder="Enter your password"
              className={'new-contact-input'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <p>Server:</p>
            <Input
              placeholder="Enter your server"
              className={'new-contact-input'}
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
            />
          </label>
          <label>
            <p>Port (optional):</p>
            <Input
              placeholder="Enter your port"
              className={'new-contact-input'}
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </label>
          <Button
            className={'login-button'}
            onClick={() =>
              applySipData(
                { server, login, password, port },
                setUa,
                setSession,
                buttonSoundRef,
                failedSoundRef,
                voiceAudioRef
              )
            }
            type="primary"
          >
            Login
          </Button>
        </form>
      </>
    );
  }
);

export default Login;
