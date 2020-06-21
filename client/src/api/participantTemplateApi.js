import constants from '../util/constants';

export const participantTemplateApi = () => ({
  async fetchItems(idToken) {
    try {
      const response = await fetch(
        `${constants.serverUrl}/participantTemplates`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  },

  async fetchItem(itemId, idToken) {
    try {
      const response = await fetch(
        `${constants.serverUrl}/participantTemplates/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  },

  async addItem(item, idToken) {
    try {
      const response = await fetch(
        `${constants.serverUrl}/participantTemplates/template`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ template: item })
        }
      );

      return response;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  },

  async updateItem(item, idToken) {
    try {
      const response = await fetch(
        `${constants.serverUrl}/participantTemplates/template/${item._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ template: item })
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  },

  async deleteItem(itemId, idToken) {
    try {
      const response = await fetch(
        `${constants.serverUrl}/participantTemplates/template/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      return response;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  }
});
