/**
 * Bcrypt is a library used to securely hash passwords before storing them
 * in the database. It uses a one-way hashing algorithm, which means the
 * original password cannot be retrieved from the hash.
 *
 * Salt Rounds (Cost Factor):
 * - The second argument in bcrypt.hash() is the salt rounds (cost factor).
 * - Bcrypt generates a random salt and applies the hashing algorithm
 *   repeatedly based on the number of rounds.
 * - Higher salt rounds = More secure because it takes longer to crack.
 * - Higher salt rounds = Slower hashing, which also increases CPU usage.
 * - A value of 10 is the recommended balance between security and performance
 *   for most web applications.
 *
 * bcrypt.hash(plainPassword, saltRounds):
 * - plainPassword: User's original password.
 * - saltRounds: Number of hashing iterations.
 * - Returns a hashed password that is safe to store in the database.
 */
 "Bcrypt is a password hashing library that securely stores passwords using a one-way hashing algorithm. 
 It automatically generates a unique random salt for every password, so even identical passwords produce different hashes. 
 The salt rounds (cost factor) control how computationally expensive the hashing process is. A value of 10 is commonly used because it provides a good balance between security and application performance. 
 During login, we use bcrypt.compare() to verify the password instead of decrypting the hash, since bcrypt hashes cannot be reversed."




Q1. Why use bcrypt.compare() instead of comparing strings?

The password stored in the database is hashed, not plain text. bcrypt.compare() hashes the entered password using the salt embedded in the stored hash and safely compares the results.

Q2. Why don't we decrypt the stored password?

Passwords should never be decrypted because bcrypt is a one-way hashing algorithm. During login, we verify the password by hashing the input again and comparing it to the stored hash.

Q3. Why return JSON instead of plain text?

JSON provides a consistent API response structure that is easy for frontend applications and other clients to parse and extend with additional information such as error codes or metadata.