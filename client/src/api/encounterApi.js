import constants from '../util/constants';
import { createApi } from './createApi';

export const encounterApi = () =>
  createApi({
    fetchItems: (idToken) =>
      fetch(`${constants.serverUrl}/encounters`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }),

    fetchItem: (itemId, idToken) =>
      fetch(`${constants.serverUrl}/encounters/${itemId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }),

    fetchLatestItem: (idToken) =>
      fetch(`${constants.serverUrl}/encounters/latestEncounter`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }),

    fetchItemAvatarUrls: (itemId, idToken) =>
      fetch(`${constants.serverUrl}/images/encounterAvatarUrls/${itemId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }),

    addItem: (item, idToken) =>
      fetch(`${constants.serverUrl}/encounters/encounter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ encounter: item })
      }),

    updateItem: (itemId, partialUpdate, idToken) =>
      fetch(`${constants.serverUrl}/encounters/encounter/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ partialUpdate })
      }),

    updateChildItem: (itemId, childItemId, partialUpdate, idToken) =>
      fetch(
        `${constants.serverUrl}/encounters/encounter/${itemId}/participant/${childItemId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ partialUpdate })
        }
      ),

    deleteItem: (itemId, idToken) =>
      fetch(`${constants.serverUrl}/encounters/encounter/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })
  });
