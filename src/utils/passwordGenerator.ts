const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
};

export function generatePassword(length: number = 12): string {
  const allChars = CHARS.lowercase + CHARS.uppercase + CHARS.numbers + CHARS.symbols;
  let password = '';

  // Ensure at least one character from each category
  password += CHARS.lowercase[Math.floor(Math.random() * CHARS.lowercase.length)];
  password += CHARS.uppercase[Math.floor(Math.random() * CHARS.uppercase.length)];
  password += CHARS.numbers[Math.floor(Math.random() * CHARS.numbers.length)];
  password += CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

// Simple hash function for demo purposes (not cryptographically secure)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hashed_${Math.abs(hash).toString(16)}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}
