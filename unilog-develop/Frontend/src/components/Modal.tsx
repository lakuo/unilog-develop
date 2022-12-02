import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiForm
} from '@elastic/eui';
import React, { FormEventHandler, ReactNode, useState } from 'react';

interface Props {
  active: boolean;
  header: ReactNode;
  footer?: ReactNode;
  width?: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
}

export default function Modal(props: Props) {
  const { active, header, footer, width, children, onClose, onSubmit } = props;

  if (!active) return null;

  const handleSubmit: FormEventHandler<HTMLFormElement> = ev => {
    ev.preventDefault();
    onSubmit?.();
  };

  return (
    <EuiOverlayMask>
      <EuiModal
        onClose={onClose}
        style={width ? { width, minWidth: 'auto' } : {}}
      >
        <EuiForm component="form" onSubmit={handleSubmit}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>{header}</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>{children}</EuiModalBody>
          {footer && <EuiModalFooter>{footer}</EuiModalFooter>}
        </EuiForm>
      </EuiModal>
    </EuiOverlayMask>
  );
}

export function useModal() {
  const [active, setActive] = useState(false);

  const open = (): any => {
    setActive(true);
  };

  const close = (): any => {
    setActive(false);
  };

  const toggle = (): any => {
    setActive(prev => !prev);
  };

  return { active, open, close, toggle };
}
