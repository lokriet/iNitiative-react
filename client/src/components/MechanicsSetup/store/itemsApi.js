import constants from '../../../util/constants';
import { createApi } from '../../../store/api/createApi';

export const itemsApi = (itemName, isHomebrew) =>
  createApi({
    fetchItems: (idToken) =>
      fetch(
        `${constants.serverUrl}/${itemName}s/${
          isHomebrew ? 'homebrew' : 'shared'
        }`,
        isHomebrew
          ? {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            }
          : {}
      ),

    addItem: (item, idToken) =>
      fetch(`${constants.serverUrl}/${itemName}s/${itemName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ [itemName]: item, isHomebrew })
      }),

    updateItem: (item, idToken) =>
      fetch(`${constants.serverUrl}/${itemName}s/${itemName}/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ [itemName]: item, isHomebrew })
      }),

    deleteItem: (itemId, idToken) =>
      fetch(`${constants.serverUrl}/${itemName}s/${itemName}/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
  });
