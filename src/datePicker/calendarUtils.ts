import { add, differenceInDays, format, isBefore, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { DateRange } from './types';
import { DatePickerOptions } from './DatePicker';

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_TRIMESTER = 3;
const MONTHS_IN_YEAR = 12;
const MINUTE_IN_MILLISECONDS = 60 * 1000;

export const getMonthRange = (from: Date) => {
    const start = startOfDay(startOfMonth(from));
    const end = add(start, { months: 1 });
    const length = differenceInDays(end, start);
    return { start, end, length };
};

export const isDateInRange = (date: Date, { start, end }: Omit<DateRange, 'length'>): boolean =>
    date.valueOf() >= start.valueOf() && isBefore(date, end);

export const getMonthDisplayRange = (from: Date, options: DatePickerOptions) => {
    const range = getMonthRange(from);
    const displayStart = startOfWeek(range.start, { weekStartsOn: options.weekStartsOn });
    const numberOfDays = Math.ceil(differenceInDays(range.end, displayStart) / DAYS_IN_WEEK) * DAYS_IN_WEEK;
    return {
        start: displayStart,
        end: add(displayStart, { days: numberOfDays - 1 }),
        length: numberOfDays,
    };
};
export const getWeekRange = (from: Date, options: DatePickerOptions) => {
    const start = startOfDay(startOfWeek(from, { weekStartsOn: options.weekStartsOn }));
    const end = add(start, { weeks: 1 });
    return {
        start,
        end,
        length: DAYS_IN_WEEK,
    };
};
export const getDayRange = (from: Date) => {
    const minutesPerDay = 60 * 24;
    const start = roundAtMinutes(from, minutesPerDay, 'floor');
    return {
        start,
        end: add(startOfDay(start), { days: 1 }),
        length: 1,
    };
};

const roundAtMinutes = (date: Date, minutePrecision: number, roundingOption: 'floor' | 'ceil'): Date => {
    if (minutePrecision <= 0) {
        throw new Error('Minute precision should be greater than 0');
    }
    const fromTimestamp = startOfDay(date).getTime();
    const seedTimestamp = date.getTime();
    const precision = minutePrecision * MINUTE_IN_MILLISECONDS;
    const roundingMethod = roundingOption === 'floor' ? Math.floor : Math.ceil;
    const roundedTimeStamp = roundingMethod((seedTimestamp - fromTimestamp) / precision) * precision;
    return new Date(fromTimestamp + roundedTimeStamp);
};

export const getDatesInRange = ({ start, length }: DateRange): Date[] =>
    Array.from({ length }, (_, i) => add(start, { days: i }));

export const isDateOutOfMonthRange = (date: Date, displayedDate: Date) => date.getMonth() !== displayedDate.getMonth();

export const getLocalizedDayNames = (options: DatePickerOptions): string[] => {
    const daysNames: string[] = [];
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
        const day = (options.weekStartsOn + i) % DAYS_IN_WEEK;
        const date = new Date(2024, 0, day);
        const dayName = format(date, 'EE');
        daysNames.push(dayName);
    }
    return daysNames;
};

export const getLocalizedMonthsNames = () => {
    const monthsNames: string[] = [];
    for (let i = 0; i < MONTHS_IN_YEAR; i++) {
        const date = new Date(2024, i, 1);
        monthsNames.push(format(date, 'MMMM'));
    }
    return monthsNames;
};
