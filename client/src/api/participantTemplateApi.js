import constants from '../util/constants';
import { createApi } from './createApi';

export const participantTemplateApi = () => createApi({
  fetchItems: (idToken) => fetch(
        `${constants.serverUrl}/participantTemplates`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      ),

  fetchItem: (itemId, idToken) => fetch(
        `${constants.serverUrl}/participantTemplates/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      ),

  addItem: (item, idToken) => fetch(
        `${constants.serverUrl}/participantTemplates/template`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ template: item })
        }
      ),

  updateItem: (item, idToken) => fetch(
        `${constants.serverUrl}/participantTemplates/template/${item._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ template: item })
        }
      ),

  deleteItem: (itemId, idToken) => fetch(
        `${constants.serverUrl}/participantTemplates/template/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
});
