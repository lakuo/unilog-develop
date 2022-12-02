import React, { RefObject, useMemo } from 'react';
import { EuiNavDrawer, EuiNavDrawerGroup } from '@elastic/eui';
import { FlyoutMenuItem } from '@elastic/eui/src/components/nav_drawer/nav_drawer_group';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { MainAccessType, SubAccessType } from 'utils/accessLevel';
import TextIcon from 'components/TextIcon';

interface Props {
  navDrawerRef: RefObject<EuiNavDrawer>;
}
export default function SideNav({ navDrawerRef }: Props) {
  const { listItems } = useDrawer();

  return (
    <EuiNavDrawer ref={navDrawerRef}>
      <EuiNavDrawerGroup listItems={listItems} />
    </EuiNavDrawer>
  );
}

function useDrawer() {
  const { getAccessLevel, isMainTitleReadable } = useGlobalState();

  /** 子標題 */
  const subItems = useMemo<(FlyoutMenuItem & { active?: boolean })[][]>(
    () => [
      [
        {
          label: 'Discover',
          iconType: 'discoverApp',
          href: '/#/log/discover',
          active: getAccessLevel(SubAccessType.Discover).read
        },
        {
          label: 'fortigate:對外連線',
          iconType: 'dashboardApp',
          href: '/#/log/dashboard/1',
          active: getAccessLevel(SubAccessType.Dashboard_1).read
        },
        {
          label: 'fortigate:對內連線阻擋',
          iconType: 'dashboardApp',
          href: '/#/log/dashboard/2',
          active: getAccessLevel(SubAccessType.Dashboard_2).read
        },
        {
          label: '受攻擊次數統計及圖表',
          iconType: 'dashboardApp',
          href: '/#/log/dashboard/3',
          active: getAccessLevel(SubAccessType.Dashboard_3).read
        },
        {
          label: '入口網登入次數統計',
          iconType: 'dashboardApp',
          href: '/#/log/statistics/1',
          active: getAccessLevel(SubAccessType.PortalStatistics_1).read
        },
        {
          label: '入口網登入阻擋次數統計',
          iconType: 'dashboardApp',
          href: '/#/log/statistics/2',
          active: getAccessLevel(SubAccessType.PortalStatistics_2).read
        },
        {
          label: '入口網使用者成功登入次數',
          iconType: 'dashboardApp',
          href: '/#/log/statistics/3',
          active: getAccessLevel(SubAccessType.PortalStatistics_3).read
        },
        {
          label: '日誌報表',
          iconType: 'watchesApp',
          href: '/#/log/report',
          active: getAccessLevel(SubAccessType.LogReport).read
        },
        {
          label: 'Log備份',
          iconType: 'watchesApp',
          href: '/#/log/backup',
          active: getAccessLevel(SubAccessType.LogBackup).read
        },
        {
          label: '日誌告警',
          iconType: 'watchesApp',
          href: 'https://10.138.14.113:8082/',
          target: '_blank',
          active: getAccessLevel(SubAccessType.LogAlert).read
        },
        {
          label: '檔案監控',
          iconType: 'dashboardApp',
          href: '/#/log/watchLog',
          active: getAccessLevel(SubAccessType.WatchLog).read
        }
      ],
      [
        {
          label: 'UniNOC',
          iconType: 'dashboardApp',
          href: '/#/noc',
          active: getAccessLevel(SubAccessType.UniNOC).read
        }
      ],
      [
        {
          label: 'UniWatch',
          iconType: 'dashboardApp',
          href: '/#/watch',
          active: getAccessLevel(SubAccessType.UniWatch).read
        }
      ]
    ],
    [getAccessLevel]
  );

  /** 父標題 */
  const mainItems = useMemo<(FlyoutMenuItem & { active?: boolean })[]>(
    () => [
      {
        label: 'UniLOG',
        iconType: () => <TextIcon>L</TextIcon>,
        flyoutMenu: {
          title: 'UniLOG',
          listItems: subItems[0]
            .filter(item => item.active)
            .map(item => {
              delete item.active;
              return item;
            })
        },
        active: isMainTitleReadable(MainAccessType.UniLOG)
      },
      {
        label: 'UniNOC',
        iconType: () => <TextIcon>N</TextIcon>,
        flyoutMenu: {
          title: 'UniNOC',
          listItems: subItems[1]
            .filter(item => item.active)
            .map(item => {
              delete item.active;
              return item;
            })
        },
        active: isMainTitleReadable(MainAccessType.UniNOC)
      },
      {
        label: 'UniWatch',
        iconType: () => <TextIcon>W</TextIcon>,
        flyoutMenu: {
          title: 'UniWatch',
          listItems: subItems[2]
            .filter(item => item.active)
            .map(item => {
              delete item.active;
              return item;
            })
        },
        active: isMainTitleReadable(MainAccessType.UniWatch)
      }
    ],
    [isMainTitleReadable, subItems]
  );

  const listItems = useMemo(
    () =>
      mainItems
        .filter(item => item.active)
        .map(item => {
          delete item.active;
          return item;
        }),
    [mainItems]
  );

  return { listItems };
}
