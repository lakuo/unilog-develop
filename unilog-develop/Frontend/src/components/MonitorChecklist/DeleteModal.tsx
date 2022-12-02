import React, { useState } from 'react';
import { EuiButton } from '@elastic/eui';

import Modal from 'components/Modal';
import { useGlobalUI } from 'contexts/GlobalUIContext';

interface Props {
  active: boolean;
  delRequest: () => Promise<any>;
  onClose: () => void;
  onDelete: () => void;
}
export default function DeleteModal(props: Props) {
  const { active, delRequest, onClose, onDelete } = props;
  const { toast } = useGlobalUI();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    delRequest()
      .then(() => {
        onDelete();
        toast.addToast('success', '刪除成功');
      })
      .catch(() => toast.addToast('error', '刪除失敗'))
      .finally(() => {
        onClose();
        setLoading(false);
      });
  };

  return (
    <Modal
      active={active}
      header="刪除"
      onClose={loading ? () => {} : onClose}
      footer={
        <>
          <EuiButton onClick={onClose} disabled={loading}>
            取消
          </EuiButton>
          <EuiButton onClick={handleDelete} isLoading={loading} color="danger">
            刪除
          </EuiButton>
        </>
      }
    >
      確定要刪除嗎？
    </Modal>
  );
}
