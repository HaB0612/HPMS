const featureValidator = {
  name: async (name) => {
    if (!name) {
      return "Lütfen bir isim girin.";
    }
    return false;
  },
  description: async (description) => {
    if (!description) "Lütfen bir açıklama girin.";
    return false;
  },
};
