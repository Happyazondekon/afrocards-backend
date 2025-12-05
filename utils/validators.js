// Validation des champs
const validators = {
  // Validation email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validation mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)
  isValidPassword: (password) => {
    if (password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasNumber;
  },

  // Validation pseudo (3-50 caractères, alphanumériques et _)
  isValidPseudo: (pseudo) => {
    const pseudoRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return pseudoRegex.test(pseudo);
  },

  // Validation âge
  isValidAge: (age) => {
    return age >= 13 && age <= 120;
  }
};

module.exports = validators;