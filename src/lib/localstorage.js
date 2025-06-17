export const storage = {
  get(key) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch (parseError) {
        console.warn(
          `Warning: Failed to parse JSON for key [${key}]:`,
          parseError
        );
        return value; // fallback to raw string
      }
    } catch (error) {
      console.error(`Error getting key [${key}] from localStorage:`, error);
      return null;
    }
  },

  set(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error setting key [${key}] in localStorage:`, error);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key [${key}] from localStorage:`, error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
