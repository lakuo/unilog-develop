import React, {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';

import PageLayout from 'layouts/PageLayout';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiSpacer,
  EuiButton,
  EuiFieldText,
  EuiBasicTableColumn
} from '@elastic/eui';
import RecoverModal from 'components/Log/Backup/RecoverModal';
import { getBackupMain } from 'utils/api/unilog';
import { RoutePath } from 'utils/enums';
import FlexControl from 'components/FlexControl';
import { useHistory } from 'react-router-dom';
import { CustomTableOptions, useCustomTable } from 'hooks/useCustomTable';
import CustomTable, { LoadingState } from 'components/CustomTable';
import { UniLogBackupItem } from 'utils/api/unilog/model';
import { useDelayValue } from 'hooks/useDelayValue';
import { FlexGrow } from 'utils/types';
import { SingleChoiceCheckBox } from 'components/SingleChoiceCheckBox';
import { dateTimeToString } from 'utils/scripts';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

export default function Backup() {
  const { getAccessLevel } = useGlobalState();
  const [checkedId, setCheckedId] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const {
    onRefreshClick,
    onBackupBtnClick,
    onPolicyBtnClick,
    onRecoverBtnClick
  } = useBackupActions(setModalActive, setTrigger);
  const controls = useFlexControl(onRefreshClick);
  const { tableProps } = useBackupTable(
    controls.value.fileName,
    checkedId,
    setCheckedId,
    trigger,
    () => setCheckedId('')
  );

  return (
    <PageLayout title="Log備份">
      <EuiPageContent>
        <EuiPageContentBody>
          <FlexControl controls={controls.props} />
          <EuiSpacer size="l" />
          <CustomTable
            className="backup-table"
            {...tableProps}
            itemId="zip_name"
          />
          <EuiSpacer size="l" />
          <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
            {getAccessLevel(SubAccessType.BackupList).read && (
              <EuiButton onClick={onBackupBtnClick}>排程清單</EuiButton>
            )}
            {getAccessLevel(SubAccessType.BackupPolicy).read && (
              <>
                <div style={{ width: '16px' }} />
                <EuiButton onClick={onPolicyBtnClick}>排程規則</EuiButton>
              </>
            )}
            {getAccessLevel(SubAccessType.LogBackup).write && (
              <>
                <div style={{ width: '16px' }} />
                <EuiButton onClick={onRecoverBtnClick} disabled={!checkedId}>
                  復原
                </EuiButton>
              </>
            )}
          </EuiFlexGroup>
        </EuiPageContentBody>
      </EuiPageContent>
      <RecoverModal
        id={checkedId}
        active={modalActive && !!checkedId}
        onClose={() => setModalActive(false)}
        onSubmit={() => {}}
      />
    </PageLayout>
  );
}

/* 動作 */
function useBackupActions(
  setModalActive: Dispatch<SetStateAction<boolean>>,
  setTrigger: Dispatch<SetStateAction<boolean>>
) {
  const { push } = useHistory();

  const onRefreshClick = () => {
    setTrigger(prev => !prev);
  };

  const onBackupBtnClick = () => {
    push(RoutePath.LogBackupList);
  };

  const onPolicyBtnClick = () => {
    push(RoutePath.LogBackupPolicy);
  };

  const onRecoverBtnClick = () => {
    setModalActive(true);
  };

  return {
    onRefreshClick,
    onPolicyBtnClick,
    onBackupBtnClick,
    onRecoverBtnClick
  };
}

/* 表單 */
function useBackupTable(
  zipName: string,
  checkedId: string,
  setCheckedId: Dispatch<SetStateAction<string>>,
  trigger: boolean,
  onUpdate: (items: UniLogBackupItem[]) => void
) {
  const [loadingState, setLoadingState] = useState<LoadingState>('none');
  const columns = useColumns(loadingState, checkedId, setCheckedId);
  const options = useRef<CustomTableOptions<UniLogBackupItem>>({
    size: 10,
    onUpdate
  });

  const fetcher = useCallback(() => {
    trigger.valueOf();
    return getBackupMain(zipName);
  }, [zipName, trigger]);

  return useCustomTable(
    loadingState,
    setLoadingState,
    fetcher,
    columns,
    'zip_name',
    options.current
  );
}

/* 欄位格式 */
function useColumns(
  loadingState: LoadingState,
  checkedId: string,
  setCheckedId: Dispatch<SetStateAction<string>>
) {
  const columns = useMemo<EuiBasicTableColumn<UniLogBackupItem>[]>(
    () => [
      {
        name: '',
        render: (value: UniLogBackupItem) => (
          <SingleChoiceCheckBox
            id={value.zip_name}
            checkedId={checkedId}
            disabled={loadingState !== 'none'}
            setCheckedId={setCheckedId}
          />
        ),
        style: { width: '50px' }
      },
      { field: 'index_name', name: 'index 名稱' },
      { field: 'state', name: '狀態' },
      { field: 'zip_name', name: '備份檔名' },
      {
        field: 'start_time',
        name: '備份起始時間',
        render: (value: string) => dateTimeToString(value)
      },
      {
        field: 'end_time',
        name: '備份結束時間',
        render: (value: string) => dateTimeToString(value)
      }
    ],
    [checkedId, loadingState, setCheckedId]
  );

  return columns;
}

/** 搜尋條件 */
function useFlexControl(onRefreshClick: () => void) {
  const fileName = useInput('備份檔名');

  const refreshBtnProps = {
    label: '　',
    grow: false,
    style: { marginLeft: 'auto' },
    render: () => (
      <EuiButton onClick={onRefreshClick}>備份清單Refresh</EuiButton>
    )
  };

  return {
    value: { fileName: fileName.value },
    props: [fileName.props, refreshBtnProps]
  };
}

/** 輸入框 */
function useInput(label: string) {
  const [value, setValue] = useState('');
  const delayValue = useDelayValue(value);

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { value } = e.target;
    setValue(value);
  };

  return {
    value: delayValue,
    props: {
      label,
      grow: 1 as FlexGrow,
      render: () => <EuiFieldText {...{ value, onChange }} />
    }
  };
}
