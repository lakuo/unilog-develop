import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { EuiNavDrawer } from '@elastic/eui';

import { useGlobalState } from 'contexts/GlobalStateContext';
import EditProfile from 'pages/EditProfile';
import ChangePassword from 'pages/ChangePassword';
import UserManagement from 'pages/UserManagement';
import AuthorityManagement from 'pages/AuthorityManagement';
import Dashboard1 from 'pages/unilog/Dashboard1';
import Dashboard2 from 'pages/unilog/Dashboard2';
import Dashboard3 from 'pages/unilog/Dashboard3';
import PortalStatistics1 from 'pages/unilog/PortalStatistics1';
import PortalStatistics2 from 'pages/unilog/PortalStatistics2';
import PortalStatistics3 from 'pages/unilog/PortalStatistics3';
import Discover from 'pages/unilog/Discover';
import HostGroup from 'pages/uniwatch/HostGroup';
import NocDashboard from 'pages/uninoc/Dashboard';
import Loading from 'components/AppLoading';
import Header from 'layouts/Header';
import SideNav from 'layouts/SideNav';
import { getAccessLevel, getAccount, getConfig } from 'utils/api/unilog';
import { SubAccessType } from 'utils/accessLevel';
import { setLogReportURL } from 'utils/logReport';
import Backup from 'pages/unilog/Backup';
import BackupList from 'pages/unilog/BackupList';
import Watch from 'pages/uniwatch';
import WatchLog from 'pages/unilog/WatchLog';
import LogReport from 'pages/unilog/LogReport';
import { setKibanaURL } from 'utils/api/kibana/instance';
import { RoutePath } from 'utils/enums';
import BackupPolicy from 'pages/unilog/BackupPolicy';
import { setUniNocBaseUrl } from 'utils/api/uninoc/instance';

export default function BasicLayout() {
  const { loading } = useDataInit();
  const { routes } = useRoutes();
  const navDrawerRef = useRef<EuiNavDrawer>(null);

  if (loading) return <Loading />;

  return (
    <>
      <Header onMenuButtonClick={navDrawerRef.current?.toggleOpen} />
      <SideNav navDrawerRef={navDrawerRef} />
      <Switch>
        {routes.map(({ path, component }) => (
          <Route exact path={path} key={path}>
            {component}
          </Route>
        ))}
        <Redirect to="/log/discover" />
      </Switch>
    </>
  );
}

interface routeParams {
  path: string;
  component: ReactNode;
  active: boolean;
}
/** 取得routes，並依照access level顯示 */
function useRoutes() {
  const { isLocal, getAccessLevel } = useGlobalState();

  const routes = useMemo<routeParams[]>(
    () => [
      {
        path: RoutePath.Profile,
        component: <EditProfile />,
        active: true
      },
      {
        path: RoutePath.ChangePW,
        component: <ChangePassword />,
        active: isLocal
      },
      {
        path: RoutePath.User,
        component: <UserManagement />,
        active: getAccessLevel(SubAccessType.User).read
      },
      {
        path: RoutePath.Authority,
        component: <AuthorityManagement />,
        active: getAccessLevel(SubAccessType.Authority).read
      },
      {
        path: RoutePath.Statistics1,
        component: <PortalStatistics1 />,
        active: getAccessLevel(SubAccessType.PortalStatistics_1).read
      },
      {
        path: RoutePath.Statistics2,
        component: <PortalStatistics2 />,
        active: getAccessLevel(SubAccessType.PortalStatistics_2).read
      },
      {
        path: RoutePath.Statistics3,
        component: <PortalStatistics3 />,
        active: getAccessLevel(SubAccessType.PortalStatistics_3).read
      },
      {
        path: RoutePath.Discover,
        component: <Discover />,
        active: getAccessLevel(SubAccessType.Discover).read
      },
      {
        path: RoutePath.Dashboard1,
        component: <Dashboard1 />,
        active: getAccessLevel(SubAccessType.Dashboard_1).read
      },
      {
        path: RoutePath.Dashboard2,
        component: <Dashboard2 />,
        active: getAccessLevel(SubAccessType.Dashboard_2).read
      },
      {
        path: RoutePath.Dashboard3,
        component: <Dashboard3 />,
        active: getAccessLevel(SubAccessType.Dashboard_3).read
      },
      {
        path: RoutePath.LogBackup,
        component: <Backup />,
        active: getAccessLevel(SubAccessType.LogBackup).read
      },
      {
        path: RoutePath.LogBackupList,
        component: <BackupList />,
        active: getAccessLevel(SubAccessType.BackupList).read
      },
      {
        path: RoutePath.LogBackupPolicy,
        component: <BackupPolicy />,
        active: getAccessLevel(SubAccessType.BackupPolicy).read
      },
      {
        path: RoutePath.LogReport,
        component: <LogReport />,
        active: getAccessLevel(SubAccessType.LogReport).read
      },
      {
        path: RoutePath.WatchLog,
        component: <WatchLog />,
        active: getAccessLevel(SubAccessType.WatchLog).read
      },
      {
        path: RoutePath.UniNOC,
        component: <NocDashboard />,
        active: getAccessLevel(SubAccessType.UniNOC).read
      },
      {
        path: RoutePath.UniWatch,
        component: <Watch />,
        active: getAccessLevel(SubAccessType.UniWatch).read
      },
      {
        path: RoutePath.HostGroup,
        component: <HostGroup />,
        active: getAccessLevel(SubAccessType.HostGroup).read
      }
    ],
    [isLocal, getAccessLevel]
  );

  return { routes: routes.filter(item => item.active) };
}

/** 取得頁面的讀寫權限、API網址 */
function useDataInit() {
  const { push } = useHistory();
  const {
    hasBackend,
    isLoggedIn,
    setIsLocal,
    setGroupID,
    setAccessLevels
  } = useGlobalState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!hasBackend) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const info = await getAccount();
        const accessLevels = await getAccessLevel();
        const kibanaUrl = await getConfig('KIBANA_BASE_URL');
        const logReportUrl = await getConfig('LOG_REPORT_API_URL');
        const uniNocUrl = await getConfig('ZIBBIX_API_URL');
        setIsLocal(Boolean(info.isLocal));
        setGroupID(info.groupId);
        setAccessLevels(accessLevels);
        setKibanaURL(kibanaUrl);
        setLogReportURL(logReportUrl);
        setUniNocBaseUrl(uniNocUrl);
        setLoading(false);
      } catch {
        push(RoutePath.Login);
      }
    };

    init();
  }, [hasBackend, isLoggedIn, push, setAccessLevels, setGroupID, setIsLocal]);

  return { loading };
}
