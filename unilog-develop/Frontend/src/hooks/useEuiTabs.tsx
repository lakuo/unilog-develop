import { useState } from 'react';

type Tab = { label: string; value: string };

export function useEuiTabs(tabs: Tab[]) {
  const [value, setValue] = useState<string>(tabs[0].value);

  return {
    value,
    items: tabs.map(tab => ({
      label: tab.label,
      value: tab.value,
      isSelected: tab.value === value,
      onClick: () => setValue(tab.value)
    }))
  };
}
