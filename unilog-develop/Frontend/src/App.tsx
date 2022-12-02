import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { useGlobalState } from 'contexts/GlobalStateContext';
import Login from 'pages/Login';
import BasicLayout from 'layouts/BasicLayout';
import { useAxiosLogInit } from 'utils/api/unilog/instance';
import GlobalUI from 'components/GlobalUI';
import { RoutePath } from 'utils/enums';

export default function App() {
  const { initialized } = useAxiosLogInit();

  if (!initialized) return null;

  return (
    <>
      <GlobalUI />
      <Routes />
    </>
  );
}

function Routes() {
  const { isLoggedIn } = useGlobalState();

  if (isLoggedIn) {
    return (
      <Switch>
        <Route path="/" component={BasicLayout} />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path={RoutePath.Login} exact component={Login} />
        <Redirect to={RoutePath.Login} />
      </Switch>
    );
  }
}
