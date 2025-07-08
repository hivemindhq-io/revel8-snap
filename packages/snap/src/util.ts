export const ellipsizeString = (
  str: string | undefined | null,
  length: number,
) => {
  if (!str) {
    return '';
  }
  if (str.length < length) {
    return str;
  }
  const first = str.substring(0, length / 2 - 2);
  const second = str.substring(str.length - length / 2 - 2, str.length);
  const combined = [first, second].join('...');
  return combined;
};

export const ellipsizeHex = (
  hexString: string,
  length: number = 12,
): string => {
  if (!hexString?.startsWith('0x')) {
    throw new Error('Invalid hex');
  }
  const prefix = '0x';
  const payload = hexString.replace('0x', '');
  const shortenedPayload = ellipsizeString(payload, length);
  return `${prefix}${shortenedPayload}`;
};
