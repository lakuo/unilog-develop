import React from 'react';
import {
  EuiConfirmModal,
  EuiGlobalToastList,
  EuiOverlayMask
} from '@elastic/eui';

import { useGlobalUI } from 'contexts/GlobalUIContext';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';

export default function GlobalUI() {
  const { toast, confirmModal } = useGlobalUI();

  const removeToast = (target: Toast) => {
    toast.removeToast(target.id);
  };

  return (
    <>
      <EuiGlobalToastList
        toasts={toast.values}
        dismissToast={removeToast}
        toastLifeTimeMs={2000}
      />
      {confirmModal.active && (
        <EuiOverlayMask>
          <EuiConfirmModal {...confirmModal.values} />
        </EuiOverlayMask>
      )}
    </>
  );
}
