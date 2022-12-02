import React, { createContext, ReactNode, useContext, useState } from 'react';

import {
  MainAccessType,
  SubAccessType,
  useAccessLevel
} from 'utils/accessLevel';
import { checkUUID } from 'utils/api/unilog';
import { UniLogAccessLevelInfo } from 'utils/api/unilog/model';
import { SetState } from 'utils/types';

type GetAccessLevel = (
  type: SubAccessType
) => { read: boolean; write: boolean };

interface ContextProps {
  hasBackend: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: SetState<boolean>;
  isLocal: boolean;
  setIsLocal: SetState<boolean>;
  accessLevels: UniLogAccessLevelInfo[];
  groupID: number;
  setGroupID: SetState<number>;
  setAccessLevels: SetState<UniLogAccessLevelInfo[]>;
  getAccessLevel: GetAccessLevel;
  isMainTitleReadable: (type: MainAccessType) => boolean;
}
const GlobalStateContext = createContext({} as ContextProps);

interface ProviderProps {
  hasBackend: boolean;
  children: ReactNode;
}
export function GlobalStateProvider(props: ProviderProps) {
  const { hasBackend, children } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(hasBackend ? checkUUID() : true);
  const [isLocal, setIsLocal] = useState(false);
  const [groupID, setGroupID] = useState(0);

  const {
    accessLevels,
    setAccessLevels,
    getAccessLevel,
    isMainTitleReadable
  } = useAccessLevel(hasBackend);

  return (
    <GlobalStateContext.Provider
      value={{
        hasBackend,
        isLoggedIn,
        isLocal,
        setIsLocal,
        accessLevels,
        setIsLoggedIn,
        setAccessLevels,
        getAccessLevel,
        groupID,
        setGroupID,
        isMainTitleReadable
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
