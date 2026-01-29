// Regex: Min 8 chars, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validatePassword = (password) => {
    return passwordRegex.test(password);
};

export const validateEmail = (email) => {
    return emailRegex.test(email);
};