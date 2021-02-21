//Import helper function
const { encryptPWD, comparePWD } = require('./helper');
// Encryption example
const encryptedPWD = encryptPWD("admin")
console.log(encryptedPWD);
// Decryption example if Passwords match
const matcher_True = comparePWD("admin", encryptedPWD)
console.log(matcher_True); // True
// Decryption example if Passwords do not match
const matcher_False = comparePWD("jagan mohan", encryptedPWD)
console.log(matcher_False); // False