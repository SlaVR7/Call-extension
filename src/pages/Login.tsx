import { FC, useEffect, useState } from 'react';
import { LoginProps } from '../lib/interfaces.ts';
import { Button, Flex, Input, notification } from 'antd';
import { store } from '../store/store.ts';
import { applySipData } from '../lib/utils/jsSipAuth.ts';
import { observer } from 'mobx-react';

const Login: FC<LoginProps> = observer(
  ({ setUa, setSession, buttonSoundRef, failedSoundRef, voiceAudioRef }) => {
    const [api, contextHolder] = notification.useNotification();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');
    const [port, setPort] = useState('');

    useEffect(() => {
      if (localStorage.getItem('sipData')) {
        applySipData(
          JSON.parse(localStorage.getItem('sipData')!),
          setUa,
          setSession,
          buttonSoundRef,
          failedSoundRef,
          voiceAudioRef
        )
      }
    }, []);

    const openNotification = () => {
      api.error({
        message: `Authorization error!`,
        description: 'Please check the entered data',
        placement: 'topLeft',
      });
    };
    useEffect(() => {
      if (store.stateData.isAuthError) openNotification();
    }, [store.stateData.isAuthError]);

    return (
      <>
        {localStorage.getItem('sipData') ? (
          <Flex justify={'center'} align={'center'} className={'loader-wrapper'}>
            <div className={'loader'}></div>
          </Flex>
        ) : (
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
        )
        }
      </>
    );
  }
);

export default Login;
