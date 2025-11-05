// Form validation utilities
export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

export const validateCreditCard = (cardNumber: string): boolean => {
  // Simple Luhn algorithm check
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateCheckoutForm = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!formData.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  
  if (!formData.lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  
  if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }
  
  if (!validatePhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }
  
  if (!formData.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }
  
  if (!formData.city?.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }
  
  if (!validateZipCode(formData.zipCode)) {
    errors.push({ field: 'zipCode', message: 'Invalid zip code' });
  }
  
  if (!validateCreditCard(formData.cardNumber)) {
    errors.push({ field: 'cardNumber', message: 'Invalid credit card number' });
  }
  
  return errors;
};
