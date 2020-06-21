import constants from '../util/constants';

export const itemsApi = (itemName, isHomebrew) => ({
  async fetchItems(idToken) {
    try {
      const response = await fetch(
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
        `${constants.serverUrl}/${itemName}s/${itemName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ [itemName]: item, isHomebrew })
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
        `${constants.serverUrl}/${itemName}s/${itemName}/${item._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ [itemName]: item, isHomebrew })
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
        `${constants.serverUrl}/${itemName}s/${itemName}/${itemId}`,
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
