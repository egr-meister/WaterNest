// Local-only persistence layer built on AsyncStorage.
// Handles empty storage, missing fields and corrupted JSON with safe fallbacks.

import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEY, defaultAppData, mergeAppData } from "./defaults";

export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultAppData();
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (jsonError) {
      // Corrupted JSON: fall back to defaults instead of crashing.
      return defaultAppData();
    }
    return mergeAppData(parsed);
  } catch (e) {
    return defaultAppData();
  }
}

export async function saveAppData(data) {
  try {
    const safe = mergeAppData(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return true;
  } catch (e) {
    return false;
  }
}

export async function clearAppData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
