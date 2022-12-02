import { useState } from 'react';

type ListItem = { label: string; value: string };

export function useEuiPopoverList(items: ListItem[]) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<ListItem>(items[0]);

  const toggle = () => setActive(prev => !prev);
  const close = () => setActive(false);

  const onClick = (item: ListItem) => {
    setSelected(item);
    close();
  };

  return {
    active,
    selected,
    toggle,
    close,
    items: items.map(item => ({
      ...item,
      onClick: () => onClick(item),
      isActive: item.value === selected.value
    }))
  };
}
