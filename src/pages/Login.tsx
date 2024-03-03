import {FC, useEffect, useState} from "react";
import {LoginProps} from "../lib/interfaces.ts";
import {Button, Input, notification} from "antd";

const Login:FC<LoginProps> = ({applySipData, isAuthError}) => {
  const [api, contextHolder] = notification.useNotification();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [port, setPort] = useState('');

  useEffect(() => {
    if (isAuthError) openNotification();
  }, [isAuthError]);

  const openNotification = () => {
    api.error({
      message: `Authorization error!`,
      description:
        'Please check the entered data',
      placement: "top",
    });
  };

  return (
    <div className={'display'}>
      <h1 className={'menu-title'}>Please enter your SIP data</h1>
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
          <Input placeholder="Enter your password"
                 className={'new-contact-input'}
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          <p>Server:</p>
          <Input placeholder="Enter your server"
                 className={'new-contact-input'}
                 type="text"
                 value={server}
                 onChange={(e) => setServer(e.target.value)}
          />
        </label>
        <label>
          <p>Port (optional):</p>
          <Input placeholder="Enter your port"
                 className={'new-contact-input'}
                 type="text"
                 value={port}
                 onChange={(e) => setPort(e.target.value)}
          />
        </label>
        <Button className={'login-button'}
                onClick={() => applySipData({server, login, password, port})}
                type="primary">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;


