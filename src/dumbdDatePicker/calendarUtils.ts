import { add, differenceInDays, format, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

export const DAY_START_HOUR = 6;
export const WEEK_STARTS_ON = 6;
export const DAYS_IN_WEEK = 7;
export const SHOW_WEEK_NUMBER = true;
export const ROOT_WIDTH = 560;

export const getMonthRange = (from: Date) => {
    const start = add(startOfDay(startOfMonth(from)), { hours: DAY_START_HOUR });
    const end = add(start, { months: 1 });
    const length = differenceInDays(end, start);
    return { start, end, length };
};

const KEY_FORMAT = 'yyyy-MM-dd-HH-mm';
export const getDateGroupKey = (date: Date): string => format(date, KEY_FORMAT);

export const getMonthDisplayRange = (from: Date) => {
    const range = getMonthRange(from);
    const displayStart = add(startOfWeek(range.start, { weekStartsOn: WEEK_STARTS_ON }), { hours: DAY_START_HOUR });
    const numberOfDays = Math.ceil(differenceInDays(range.end, displayStart) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
    return {
        start: displayStart,
        end: add(displayStart, { days: numberOfDays - 1 }),
        length: numberOfDays,
    };
};

export const getDatesInRange = ({ start, length }: DateRange): Date[] =>
    Array.from({ length }, (_, i) => add(start, { days: i }));

export const isDateOutOfMonthRange = (date: Date, displayedDate: Date) => date.getMonth() !== displayedDate.getMonth();

export const getLocalizedDayNames = (cols: number, dateRange: DateRange) =>
    Array.from({ length: cols }).map((_, index) => format(add(dateRange.start, { days: index }), 'EE'));

export type DateRange = {
    /** range inclusive start */
    start: Date;
    /** range inclusive end */
    end: Date;
    /** range duration in days */
    length: number;
};
