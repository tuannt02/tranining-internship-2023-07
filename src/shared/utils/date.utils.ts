import { getTime } from 'date-fns';

/**
 * Create Unix timestamp
 *
 * @param date
 */
export const dateToTimestamp = (date: Date = new Date()) => {
  const unixTimestamp = getTime(date) / 1000;
  return Math.floor(unixTimestamp);
};
