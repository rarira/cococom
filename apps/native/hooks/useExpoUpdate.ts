import { useCallback, useLayoutEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

import Util from '@/libs/util';

import { useErrorHandler } from './useErrorHandler';

export function useExpoUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { reportToSentry } = useErrorHandler();

  const checkUpdate = useCallback(() => {
    (async () => {
      try {
        if (Util.isDevClient()) return;

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setIsUpdating(true);

          Alert.alert(
            '업데이트가 있습니다',
            '새로운 업데이트가 있습니다. 업데이트를 진행하시겠어요?',
            [
              {
                text: '취소',
                style: 'cancel',
                onPress: () => setIsUpdating(false),
              },
              {
                text: '업데이트',
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                    setIsUpdating(false);
                  } catch (error) {
                    Alert.alert(
                      '업데이트 에러',
                      `업데이트 실행 중에 에러가 발생했습니다: ${error}`,
                      [
                        {
                          text: '확인',
                          onPress: () => {
                            reportToSentry(error as Error);
                            setIsUpdating(false);
                          },
                        },
                      ],
                    );
                  }
                },
              },
            ],
          );
        }
      } catch (error) {
        reportToSentry(error as Error);
      }
    })();
  }, [reportToSentry]);

  useLayoutEffect(checkUpdate, [checkUpdate]);

  return { isUpdating, checkUpdate };
}
