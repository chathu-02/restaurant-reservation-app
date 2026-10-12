/**
 * Sri Lankan Mobile Phone Validation and Normalization
 * Supports local formats (e.g. 0712345678, 0771234567, 771234567, +94771234567)
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
}

const VALID_SL_PREFIXES = ['70', '71', '72', '74', '75', '76', '77', '78'];

export function validateSriLankanPhone(input: string): PhoneValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter your phone number',
    };
  }

  // Remove spaces, hyphens, and parenthesis
  const cleaned = input.replace(/[\s\-\(\)]/g, '');

  let localDigits = '';

  if (cleaned.startsWith('+94')) {
    localDigits = cleaned.slice(3);
  } else if (cleaned.startsWith('94') && cleaned.length === 11) {
    localDigits = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    localDigits = cleaned.slice(1);
  } else if (cleaned.length === 9) {
    localDigits = cleaned;
  } else {
    return {
      isValid: false,
      normalized: '',
      error: 'Enter a valid 9 or 10-digit Sri Lankan mobile number (e.g. 077 123 4567)',
    };
  }

  // Check that all 9 digits are numbers
  if (!/^\d{9}$/.test(localDigits)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Phone number must contain numbers only',
    };
  }

  // Verify Sri Lankan mobile operator prefix (070, 071, 072, 074, 075, 076, 077, 078)
  const prefix = localDigits.slice(0, 2);
  if (!VALID_SL_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter a valid Sri Lankan mobile number starting with 07X (e.g. 077, 071, 076)',
    };
  }

  return {
    isValid: true,
    normalized: `+94${localDigits}`,
  };
}

export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+94') && cleaned.length === 12) {
    const operator = cleaned.slice(3, 5);
    const part1 = cleaned.slice(5, 8);
    const part2 = cleaned.slice(8, 12);
    return `+94 ${operator} ${part1} ${part2}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    const operator = cleaned.slice(0, 3);
    const part1 = cleaned.slice(3, 6);
    const part2 = cleaned.slice(6, 10);
    return `${operator} ${part1} ${part2}`;
  }
  return phone;
}
