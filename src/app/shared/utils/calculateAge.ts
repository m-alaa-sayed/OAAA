/**
 * Calculates age based on birth date
 * @param birthDate - The birth date as a Date object or date string
 * @returns The calculated age in years
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Check if the birth date is valid
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birth date provided');
  }
  
  // Check if birth date is in the future
  if (birth > today) {
    throw new Error('Birth date cannot be in the future');
  }
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If birthday hasn't occurred this year yet, subtract 1 from age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calculates age with more detailed information
 * @param birthDate - The birth date as a Date object or date string
 * @returns Object with years, months, and days
 */
export function calculateDetailedAge(birthDate: Date | string): { years: number; months: number; days: number } {
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Check if the birth date is valid
  if (isNaN(birth.getTime())) {
    throw new Error('Invalid birth date provided');
  }
  
  // Check if birth date is in the future
  if (birth > today) {
    throw new Error('Birth date cannot be in the future');
  }
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

/**
 * Formats age as a readable string
 * @param birthDate - The birth date as a Date object or date string
 * @returns Formatted age string (e.g., "25 years old")
 */
export function formatAge(birthDate: Date | string): string {
  const age = calculateAge(birthDate);
  return `${age} year${age !== 1 ? 's' : ''} old`;
}

/**
 * Formats detailed age as a readable string
 * @param birthDate - The birth date as a Date object or date string
 * @returns Formatted detailed age string (e.g., "25 years, 3 months, 15 days old")
 */
export function formatDetailedAge(birthDate: Date | string): string {
  const { years, months, days } = calculateDetailedAge(birthDate);
  
  const parts: string[] = [];
  
  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  }
  
  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  }
  
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0) {
    return 'Born today';
  }
  
  return parts.join(', ') + ' old';
}
