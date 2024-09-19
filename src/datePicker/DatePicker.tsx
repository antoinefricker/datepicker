import { useEffect, useMemo, useState } from 'react';
import {
    DAYS_IN_WEEK,
    getDateGroupKey,
    getDatesInRange,
    getDayRange,
    getLocalizedDayNames,
    getLocalizedMonthsNames,
    getMonthDisplayRange,
    getMonthRange,
    getWeekRange,
    isDateInRange,
    isDateOutOfMonthRange,
} from './calendarUtils';
import { chunk } from 'lodash';
import clsx from 'clsx';
import { add, format, isToday, set } from 'date-fns';
import { LuChevronLeft } from 'react-icons/lu';
import { LuChevronRight } from 'react-icons/lu';
import { Button, Card, CardContent, ClickAwayListener, IconButton, Theme, Typography } from '@mui/material';
import { DateRange } from './types';

export const DatePicker = ({ selectionMode, handleDateChange, isStatic, options: paramsOptions }: DatePickerProps) => {
    const [opened, setOpened] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const options = getOptions(paramsOptions);

    const selectedDateRange: DateRange = useMemo(() => {
        if (selectionMode === 'day') {
            return getDayRange(selectedDate);
        } else if (selectionMode === 'week') {
            return getWeekRange(selectedDate, options);
        }
        return getMonthRange(selectedDate);
    }, [selectedDate, selectionMode]);

    useEffect(() => {
        handleDateChange(selectedDate, selectedDateRange);
    }, [selectedDateRange]);

    const openedHandler = (value: boolean) => setOpened(value || !!isStatic);

    const daysNames = getLocalizedDayNames(options);
    const displayedDateRange = getMonthDisplayRange(selectedDate, options);
    const datesInRange = getDatesInRange(displayedDateRange);
    const datesRows = chunk(datesInRange, DAYS_IN_WEEK);

    const monthsNames = getLocalizedMonthsNames();
    const monthRows = chunk(monthsNames, 4);

    const reachPrevMonth = () => setSelectedDate((selectedDate) => add(selectedDate, { months: -1 }));
    const reachNextMonth = () => setSelectedDate((selectedDate) => add(selectedDate, { months: 1 }));
    const reachPrevYear = () => setSelectedDate((selectedDate) => add(selectedDate, { years: -1 }));
    const reachNextYear = () => setSelectedDate((selectedDate) => add(selectedDate, { years: 1 }));
    const reachDate = (date: Date) => () => setSelectedDate(date);
    const reachMonth = (month: number) => () => setSelectedDate((selectedDate) => set(selectedDate, { month }));

    if (!opened) {
        return null;
    }

    return (
        <ClickAwayListener onClickAway={() => openedHandler(false)}>
            <Card elevation={4} className={classLabels.root} sx={calendarSx(options)}>
                <CardContent>
                    <div className={classLabels.browsers}>
                        {selectionMode !== 'month' && (
                            <section className={classLabels.dayPicker}>
                                <header>
                                    <Typography variant="h4">{format(selectedDate, 'MMMM yyyy')}</Typography>
                                    <IconButton aria-label="Previous month" onClick={reachPrevMonth}>
                                        <LuChevronLeft size="18" />
                                    </IconButton>
                                    <IconButton aria-label="Next month" onClick={reachNextMonth}>
                                        <LuChevronRight size="18" />
                                    </IconButton>
                                </header>
                                <table>
                                    <thead>
                                        <tr key={`daynames`}>
                                            {options.showWeekNumber && <td className={classLabels.isWeekNumber}>#</td>}
                                            {daysNames.map((dayName) => (
                                                <td key={`day_${dayName}`}>{dayName}</td>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datesRows.map((row, rowIndex) => (
                                            <tr key={`week_${rowIndex}`}>
                                                {options.showWeekNumber && (
                                                    <td className={classLabels.isWeekNumber}>
                                                        {format(row[0], 'w', { weekStartsOn: options.weekStartsOn })}
                                                    </td>
                                                )}
                                                {row.map((date) => (
                                                    <td
                                                        onClick={reachDate(date)}
                                                        className={clsx({
                                                            [classLabels.isOutOfRange]: isDateOutOfMonthRange(
                                                                date,
                                                                selectedDate,
                                                            ),
                                                            [classLabels.isToday]: isToday(date),
                                                            [classLabels.isSelected]: isDateInRange(
                                                                date,
                                                                selectedDateRange,
                                                            ),
                                                        })}
                                                        key={`day_${getDateGroupKey(date)}`}
                                                    >
                                                        {date.getDate()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )}
                        <section className={classLabels.monthPicker}>
                            <header>
                                <Typography variant="h4">{format(selectedDate, 'yyyy')}</Typography>
                                <IconButton aria-label="Previous year" onClick={reachPrevYear}>
                                    <LuChevronLeft size="18" />
                                </IconButton>
                                <IconButton aria-label="Next year" onClick={reachNextYear}>
                                    <LuChevronRight size="18" />
                                </IconButton>
                            </header>
                            <table>
                                <tbody>
                                    {monthRows.map((monthRow, monthRowIndex) => (
                                        <tr>
                                            {monthRow.map((monthName, monthNameIndex) => {
                                                const monthIndex = monthRowIndex * 4 + monthNameIndex;
                                                return (
                                                    <td
                                                        key={`month_${monthName}`}
                                                        className={clsx({
                                                            [classLabels.isSelected]:
                                                                selectionMode === 'month' &&
                                                                selectedDate.getMonth() === monthIndex,
                                                        })}
                                                    >
                                                        <Button
                                                            variant="text"
                                                            fullWidth
                                                            onClick={reachMonth(monthIndex)}
                                                        >
                                                            {monthName}
                                                        </Button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </CardContent>
            </Card>
        </ClickAwayListener>
    );
};

const getOptions = (paramsOptions: DatePickerProps['options']) =>
    ({
        dayStartHour: 5,
        weekStartsOn: 6,
        showWeekNumber: true,
        rootWidth: 640,
        ...paramsOptions,
    } as DatePickerOptions);

export type DatePickerProps = {
    isStatic?: boolean;
    handleDateChange: (date: Date, range: DateRange) => void;
    selectionMode: 'day' | 'week' | 'month';
    options?: Partial<DatePickerOptions>;
};

export type DatePickerOptions = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    showWeekNumber: boolean;
    rootWidth: number;
};

const classLabels = {
    root: 'ddp-calendarContainer',
    browsers: 'ddp-browsers',
    monthPicker: 'ddp-monthPicker',
    dayPicker: 'ddp-dayPicker',
    isToday: 'ddp--isToday',
    isOutOfRange: 'ddp--isOutOfRange',
    isWeekNumber: 'ddp-weekNumber',
    isSelected: 'ddp--isSelected',
} as const;

const calendarSx = (options: DatePickerOptions) => (theme: Theme) => ({
    [`&.${classLabels.root}`]: {
        position: 'relative',
        width: options.rootWidth,
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        '& .MuiCardContent-root': {
            p: 1,
        },
        userSelect: 'none',
    },
    [`.${classLabels.browsers}`]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 2,
        '& > section': {
            flex: '100% 0 1',
        },
    },
    [`&.${classLabels.root} header`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        h4: {
            flex: '1 1 auto',
            fontSize: '1.25rem',
            p: 0,
            m: 0,
        },
    },
    [`&.${classLabels.root} header h4`]: {
        flex: '1 1 auto',
        fontSize: '1.25rem',
        p: 0,
        m: 0,
    },
    [`&.${classLabels.root} header button`]: {
        flex: '0 0 auto',
    },

    [`.${classLabels.browsers} table`]: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    [`.${classLabels.browsers} .${classLabels.dayPicker} table td`]: {
        width: `calc(100% / ${DAYS_IN_WEEK + (options.showWeekNumber ? 1 : 0)})`,
        py: 0.25,
        px: 0.5,
        textAlign: 'right',
    },
    [`.${classLabels.browsers} .${classLabels.dayPicker} table tr td`]: {
        borderBottom: '1px solid',
        borderBottomColor: 'grey.200',
        cursor: 'pointer',
        py: 0.25,
        px: 0.75,
        [`&.${classLabels.isOutOfRange}`]: {
            opacity: 0.5,
        },
        [`&.${classLabels.isWeekNumber}`]: {
            fontWeight: 'bold',
            textAlign: 'left',
            backgroundColor: 'grey.200',
            cursor: 'default',
        },
        [`&.${classLabels.isToday}`]: {
            aspectRatio: 1,
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: 'primary.dark',
        },
        [`&.${classLabels.isSelected}`]: {
            backgroundColor: 'primary.light',
        },
    },
    [`.${classLabels.browsers} .${classLabels.monthPicker} table td`]: {
        width: `calc(100% / 4)`,
        px: 0.25,
        py: 0.25,
        button: {
            minWidth: 'unset',
            p: 0,
            color: 'text.primary',
            borderBottomStyle: 'solid',
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
        },
        [`&.${classLabels.isSelected} button`]: {
            borderBottomStyle: 'solid',
            borderBottomWidth: 2,
            borderBottomColor: 'primary.main',
        },
    },
});
