import React, { MouseEventHandler, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  EuiHeader,
  EuiHeaderSection,
  EuiShowFor,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiHeaderLogo,
  EuiAvatar,
  EuiPopover,
  EuiListGroup,
  EuiListGroupItem,
  EuiHorizontalRule
} from '@elastic/eui';

import { useGlobalState } from 'contexts/GlobalStateContext';
import { logout } from 'utils/api/unilog';
import { MainAccessType, SubAccessType } from 'utils/accessLevel';
import logo from 'assets/logo.png';
import { RoutePath } from 'utils/enums';

interface Props {
  onMenuButtonClick?: () => void;
}
export default function Header({ onMenuButtonClick }: Props) {
  const { isLocal, getAccessLevel, isMainTitleReadable } = useGlobalState();
  const {
    userMenuActive,
    setUserMenuActive,
    onListItemClick,
    handleUserMenuClose
  } = useUserMenu();

  return (
    <EuiHeader style={{ position: 'sticky', top: 0 }}>
      <EuiHeaderSection>
        <EuiShowFor sizes={['xs', 's']}>
          <EuiHeaderSectionItem border="right">
            <EuiHeaderSectionItemButton onClick={onMenuButtonClick}>
              <EuiIcon type="apps" href="#" size="m" />
            </EuiHeaderSectionItemButton>
          </EuiHeaderSectionItem>
        </EuiShowFor>
        <EuiHeaderSectionItem border="right">
          <EuiHeaderLogo iconType={logo} href="#">
            UNILOG
          </EuiHeaderLogo>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <EuiHeaderSection>
        <EuiHeaderSectionItem>
          <EuiPopover
            ownFocus
            button={
              <EuiHeaderSectionItemButton
                onClick={() => setUserMenuActive(prev => !prev)}
              >
                <EuiAvatar name="User" />
              </EuiHeaderSectionItemButton>
            }
            isOpen={userMenuActive}
            closePopover={handleUserMenuClose}
            anchorPosition="leftUp"
          >
            <EuiListGroup flush>
              <EuiListGroupItem
                onClick={onListItemClick}
                label="修改基本資料"
                name={RoutePath.Profile}
                iconType="documentEdit"
              />
              {isLocal && (
                <EuiListGroupItem
                  onClick={onListItemClick}
                  label="修改密碼"
                  name={RoutePath.ChangePW}
                  iconType="lock"
                />
              )}
              <EuiListGroupItem
                onClick={onListItemClick}
                label="登出"
                name="logout"
                iconType="popout"
              />
              {isMainTitleReadable(MainAccessType.UserMenu) && (
                <EuiHorizontalRule margin="s" />
              )}
              {getAccessLevel(SubAccessType.User).read && (
                <EuiListGroupItem
                  onClick={onListItemClick}
                  label="使用者管理"
                  name={RoutePath.User}
                  iconType="user"
                />
              )}
              {getAccessLevel(SubAccessType.Authority).read && (
                <EuiListGroupItem
                  onClick={onListItemClick}
                  label="權限管理"
                  name={RoutePath.Authority}
                  iconType="tableDensityExpanded"
                />
              )}
            </EuiListGroup>
          </EuiPopover>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </EuiHeader>
  );
}

/** 使用者頭像選單的功能 */
function useUserMenu() {
  const {
    push,
    location: { pathname }
  } = useHistory();
  const { setIsLoggedIn } = useGlobalState();
  const [userMenuActive, setUserMenuActive] = useState(false);

  const handleUserMenuClose = () => {
    setUserMenuActive(false);
  };

  const onListItemClick: MouseEventHandler<HTMLButtonElement> = ev => {
    const { name } = ev.currentTarget;
    if (name === 'logout') {
      logout();
      setIsLoggedIn(false);
    } else {
      if (name !== pathname) push(name);
    }
    handleUserMenuClose();
  };

  return {
    userMenuActive,
    setUserMenuActive,
    onListItemClick,
    handleUserMenuClose
  };
}
