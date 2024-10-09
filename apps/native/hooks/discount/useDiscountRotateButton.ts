import { useCallback, useState } from 'react';

export type RotateButtonOption<T> = {
  text: string;
  value: T;
};

export function useDiscountRotateButton<T>(options: RotateButtonOption<T>[]) {
  const [option, setOption] = useState(0);

  const handlePress = useCallback(() => {
    setOption(prev => {
      if (prev + 1 >= options.length) {
        return 0;
      }
      return prev + 1;
    });
  }, [options]);

  return { option: options[option], handlePress };
}
