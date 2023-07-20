import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(error);
  }
}

export async function setItem(key: string, value: string = '') {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
}

export async function removeItem(key: string) {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}

export async function clearAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage has been cleared.');
  } catch (error) {
    console.log('Error occured while clearing AsyncStorage:', error);
  }
}
