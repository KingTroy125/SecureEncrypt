import CryptoJS from 'crypto-js';

/**
 * Encrypts text using AES-256 encryption
 * @param text The text to encrypt
 * @param key The encryption key
 * @returns The encrypted text
 */
export const encryptText = (text: string, key: string): string => {
  try {
    // Use AES encryption
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt text');
  }
};

/**
 * Decrypts text using AES-256 encryption
 * @param encryptedText The encrypted text
 * @param key The decryption key
 * @returns The decrypted text
 */
export const decryptText = (encryptedText: string, key: string): string => {
  try {
    // Use AES decryption
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Decryption failed - incorrect key or corrupted data');
    }
    
    return decryptedText;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt text');
  }
};

/**
 * Generates a random encryption key
 * @param length The length of the key (default: 32 characters)
 * @returns A random key
 */
export const generateRandomKey = (length: number = 32): string => {
  // Generate a random word array
  const randomWordArray = CryptoJS.lib.WordArray.random(length);
  // Convert to base64 for a more user-friendly key
  return CryptoJS.enc.Base64.stringify(randomWordArray);
};

/**
 * Hashes a password using SHA-256
 * @param password The password to hash
 * @returns The hashed password
 */
export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

/**
 * Validates if the provided text is a valid encrypted string
 * @param text The text to validate
 * @returns Boolean indicating if the text is a valid encrypted string
 */
export const isValidEncryptedText = (text: string): boolean => {
  try {
    // Check if the text has the format of an encrypted string
    const pattern = /^U2FsdGVkX1.*$/;
    return pattern.test(text);
  } catch {
    return false;
  }
};