import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { EuiConfirmModalProps } from '@elastic/eui';
import moment from 'moment';

interface ConfirmModalProps extends Omit<EuiConfirmModalProps, 'onCancel'> {
  onCancel?: (
    event?:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => void;
}

interface ContextProps {
  toast: {
    values: Toast[];
    addToast: (type: ToastType, title: ReactNode, id?: string) => void;
    removeToast: (id: string) => void;
  };
  confirmModal: {
    active: boolean;
    values: EuiConfirmModalProps;
    open: (props: ConfirmModalProps) => void;
    close: () => void;
  };
}
const GlobalUIContext = createContext({} as ContextProps);

interface ProviderProps {
  children: ReactNode;
}
export function GlobalUIProvider(props: ProviderProps) {
  const { children } = props;
  const toast = useToast();
  const confirmModal = useConfirmModal();

  return (
    <GlobalUIContext.Provider value={{ toast, confirmModal }}>
      {children}
    </GlobalUIContext.Provider>
  );
}

export function useGlobalUI() {
  return useContext(GlobalUIContext);
}

export type ToastType = 'success' | 'warn' | 'error';
/** 參考：https://elastic.github.io/eui/#/display/toast */
function useToast() {
  const [values, setValues] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: ReactNode, id?: string) => {
      const props = toastMap.get(type);
      if (!props) return;
      if (!id) {
        id = moment().toString();
      }
      const newToast: Toast = {
        id,
        title,
        ...props
      };
      setValues(prev => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback(
    (id: string) => setValues(prev => prev.filter(toast => toast.id !== id)),
    []
  );

  return { values, addToast, removeToast };
}

/** 參考：https://elastic.github.io/eui/#/layout/modal */
function useConfirmModal() {
  const [active, setActive] = useState(false);
  const [values, setValues] = useState<EuiConfirmModalProps>({
    onCancel: () => setActive(false)
  });

  const open = useCallback((props: ConfirmModalProps) => {
    setValues(prev => ({ ...prev, ...props }));
    setActive(true);
  }, []);

  const close = useCallback(() => {
    setValues({ onCancel: () => setActive(false) });
    setActive(false);
  }, []);

  return { active, values, open, close };
}

type ToastColor = 'primary' | 'success' | 'warning' | 'danger';
const toastMap = new Map<ToastType, { color: ToastColor; iconType: string }>([
  ['success', { color: 'success', iconType: 'check' }],
  ['warn', { color: 'warning', iconType: 'help' }],
  ['error', { color: 'danger', iconType: 'alert' }]
]);
