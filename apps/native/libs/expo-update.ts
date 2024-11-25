import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export async function handleFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert('새로운 업데이트가 있습니다. 업데이트를 진행합니다');
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    // You can also add an alert() to see the error message in case of an error when fetching updates.
    Alert.alert(`Error fetching latest Expo update: ${error}`);
  }
}
