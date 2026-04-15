export const getState = (itemName: string) => {
  try {
    const serializedState = localStorage.getItem(itemName);
    if (serializedState === null) {
      return undefined;
    }
    try {
      // Try to parse as JSON
      return JSON.parse(serializedState);
    } catch {
      return serializedState;
    }
  } catch (e) {
    console.error(`failed to get ${itemName} from the local Storage: `, e);
    return undefined;
  }
};

export const addState = (itemName: string, state: unknown) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(itemName, serializedState);
  } catch (error) {
    console.error(`failed to add ${itemName} to the local Storage: `, error);
    return;
  }
};

export const removeState = (itemName: string) => {
  try {
    localStorage.removeItem(itemName);
  } catch (error) {
    console.error(
      `failed to delete ${itemName} from the local Storage: ${error}`,
    );
  }
};
