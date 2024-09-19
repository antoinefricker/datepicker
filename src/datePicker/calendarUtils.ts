import { add, differenceInDays, format, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { DateRange } from './types';
import { DatePickerOptions } from './DatePicker';

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_YEAR = 12;

export const getMonthRange = (from: Date, options: DatePickerOptions) => {
    const start = add(startOfDay(startOfMonth(from)), { hours: options.dayStartHour });
    const end = add(start, { months: 1 });
    const length = differenceInDays(end, start);
    return { start, end, length };
};

const KEY_FORMAT = 'yyyy-MM-dd-HH-mm';
export const getDateGroupKey = (date: Date): string => format(date, KEY_FORMAT);

export const getMonthDisplayRange = (from: Date, options: DatePickerOptions) => {
    const range = getMonthRange(from, options);
    const displayStart = add(startOfWeek(range.start, { weekStartsOn: options.weekStartsOn }), {
        hours: options.dayStartHour,
    });
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
