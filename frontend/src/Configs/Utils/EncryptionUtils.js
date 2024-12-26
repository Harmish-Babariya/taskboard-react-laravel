import CryptoJS from 'crypto-js';

const API_KEY = process.env.REACT_APP_API_KEY;

const EncryptionUtil = {
  encryptionAES: (msg) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(msg), API_KEY).toString();
    return ciphertext;
  },

  decryptionAES: (msg) => {
    if (msg) {
      const bytes = CryptoJS.AES.decrypt(msg, API_KEY);
      
      const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return originalText;
    } else {
      return null;
    }
  },

  encodeForURL(encryptData) {
    return encryptData.replace(/\+/g, 'xMl3Jk').replace(/\//g, 'Por21Ld').replace(/=/g, 'Ml32');
  },

  decodeFromURL(encodedData) {
    return encodedData.replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
  }

};

export default EncryptionUtil;


// import CryptoJS from 'crypto-js';

// const API_KEY = process.env.REACT_APP_API_KEY;

// const EncryptionUtil = {
//   encryptionAES: (msg) => {
//     const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(msg), API_KEY).toString();
//     return ciphertext;
//   },

//   decryptionAES: (msg) => {
//     try {
//       if (msg) {
//         const bytes = CryptoJS.AES.decrypt(msg, API_KEY);
//         const originalText = bytes.toString(CryptoJS.enc.Utf8);

//         // Add a check to ensure valid JSON
//         if (originalText) {
//           return JSON.parse(originalText);
//         } else {
//           console.error("Decryption failed: Empty decrypted text");
//           return null;
//         }
//       } else {
//         console.error("Decryption failed: No message provided");
//         return null;
//       }
//     } catch (error) {
//       console.error("Decryption error: Invalid JSON or message", error);
//       return null;
//     }
//   },

//   encodeForURL(encryptData) {
//     return encryptData.replace(/\+/g, 'xMl3Jk').replace(/\//g, 'Por21Ld').replace(/=/g, 'Ml32');
//   },

//   decodeFromURL(encodedData) {
//     return encodedData.replace(/xMl3Jk/g, '+').replace(/Por21Ld/g, '/').replace(/Ml32/g, '=');
//   }
// };

// export default EncryptionUtil;
