import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'userData'
};

// export const storeAuthData = async (token, user) => {
//   try {
//     const promises = [
//       SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token),
//       SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user))
//     ];
    
//     await Promise.all(promises);
//   } catch (error) {
//     console.error('Error storing auth data:', error);
//     throw error;
//   }
// };
// export const storeAuthData = async (token, user) => {
//   try {
//     const promises = [
//       SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, String(token)), // Ensure token is a string
//       SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)) // user is already being stringified
//     ];
    
//     await Promise.all(promises);
//   } catch (error) {
//     console.error('Error storing auth data:', error);
//     throw error;
//   }
// };
export const storeAuthData = async (token, user) => {
  try {
    const stringToken = token ? String(token) : '';

    const promises = [
      SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, stringToken), // Token as string
      SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)) // User as a JSON string
    ];
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
};



export const getAuthData = async () => {
  try {
    const [token, userJson] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEYS.TOKEN),
      SecureStore.getItemAsync(STORAGE_KEYS.USER)
    ]);

    return {
      token,
      user: userJson ? JSON.parse(userJson) : null
    };
  } catch (error) {
    console.error('Error retrieving auth data:', error);
    return { token: null, user: null };
  }
};

export const removeAuthData = async () => {
  try {
    const promises = [
      SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER)
    ];
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error removing auth data:', error);
    throw error;
  }
};