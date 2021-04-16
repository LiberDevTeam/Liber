import { format, isToday } from 'date-fns';

const TODAY_TIME_FORMAT = 'p';
const DEFAULT_TIME_FORMAT = 'P';
const TIME_STRICT_FORMAT = 'iiii, LLLL d, yyyy p';

export const formatTime = (time: Date) =>
  isToday(time)
    ? `Today at ${format(time, TODAY_TIME_FORMAT)}`
    : format(time, DEFAULT_TIME_FORMAT);

export const formatTimeStrict = (time: Date) =>
  format(time, TIME_STRICT_FORMAT);
