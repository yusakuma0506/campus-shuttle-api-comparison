export function requireText(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function requireEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new Error("Please enter a valid email address.");
  }
}

export function requireMinimumLength(value: string, minimum: number, label: string) {
  if (value.length < minimum) {
    throw new Error(`${label} must be at least ${minimum} characters.`);
  }
}

export function requireNumberInRange(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
) {
  if (Number.isNaN(value) || value < minimum || value > maximum) {
    throw new Error(`${label} must be between ${minimum} and ${maximum}.`);
  }
}
