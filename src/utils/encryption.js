// Simple encryption utility for feedback data
// Uses Web Crypto API for browser-based encryption

/**
 * Generates a random encryption key
 * @returns {Promise<string>} Base64 encoded key
 */
export const generateKey = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
};

/**
 * Encrypts data using AES-GCM
 * @param {string} data - Data to encrypt
 * @param {string} keyString - Base64 encoded key
 * @returns {Promise<string>} Encrypted data with IV prepended (base64)
 */
export const encryptData = async (data, keyString) => {
  try {
    // Convert base64 key back to CryptoKey
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encoded = new TextEncoder().encode(data);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

/**
 * Decrypts data using AES-GCM
 * @param {string} encryptedData - Base64 encrypted data with IV
 * @param {string} keyString - Base64 encoded key
 * @returns {Promise<string>} Decrypted data
 */
export const decryptData = async (encryptedData, keyString) => {
  try {
    // Convert base64 key back to CryptoKey
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // Decode base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

/**
 * Encryption key for feedback
 * 
 * SECURITY NOTE FOR PRODUCTION:
 * This is a deterministic passphrase for educational/demo purposes.
 * 
 * For production deployment, consider:
 * 1. Use environment variables: process.env.FEEDBACK_ENCRYPTION_KEY
 * 2. Implement key rotation policies
 * 3. Use a key management service (AWS KMS, Azure Key Vault, etc.)
 * 4. Store decryption key separately from the application code
 * 
 * Current approach rationale:
 * - Allows maintainers to decrypt feedback submissions
 * - Key is derived via SHA-256, not stored directly
 * - Feedback is already anonymous (no PII)
 * - Used only for aggregated analytics
 * - Trade-off: Accessibility vs. maximum security
 */
const FEEDBACK_KEY = 'truefriend-feedback-2024-v1-key-base64';

/**
 * Encrypts feedback for storage
 * @param {object} feedback - Feedback object
 * @returns {Promise<string>} Encrypted feedback
 */
export const encryptFeedback = async (feedback) => {
  const jsonData = JSON.stringify(feedback);
  
  // Use a deterministic key for feedback
  // In a real system, this would be managed via environment variables
  const keyHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(FEEDBACK_KEY)
  );
  const keyString = btoa(String.fromCharCode(...new Uint8Array(keyHash)));
  
  return encryptData(jsonData, keyString);
};

/**
 * Decrypts feedback
 * @param {string} encryptedFeedback - Encrypted feedback string
 * @returns {Promise<object>} Decrypted feedback object
 */
export const decryptFeedback = async (encryptedFeedback) => {
  const keyHash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(FEEDBACK_KEY)
  );
  const keyString = btoa(String.fromCharCode(...new Uint8Array(keyHash)));
  
  const decrypted = await decryptData(encryptedFeedback, keyString);
  return JSON.parse(decrypted);
};
