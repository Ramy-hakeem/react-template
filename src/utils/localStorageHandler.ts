export const getState = (itemName: string) => {
  try {
    const serializedState = localStorage.getItem(itemName);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error(`failed to get ${itemName} from the local Storage: `, error);
    return undefined;
  }
};

export const addState = (state: unknown, itemName: string) => {
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
