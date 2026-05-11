/**
 * Luhn algorithm utilities.
 * Used to generate valid card check digits and validate card numbers.
 */

/**
 * Appends the Luhn check digit to a partial card number.
 * @param partial - Card digits without the check digit (e.g. 15 digits for a 16-digit card)
 * @returns Complete card number with valid check digit
 */
export function luhnComplete(partial: string): string {
  const digits: number[] = [...partial].map(Number);
  digits.push(0); // placeholder for check digit

  let sum = 0;
  let shouldDouble = true;

  for (let i = digits.length - 2; i >= 0; i--) {
    let d = digits[i];
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return partial + checkDigit;
}

/**
 * Validates whether a full card number passes the Luhn check.
 */
export function luhnValid(number: string): boolean {
  const digits = [...number].map(Number);
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
