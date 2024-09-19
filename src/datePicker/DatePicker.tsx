import { useEffect, useMemo, useState } from 'react';
import {
    DAYS_IN_WEEK,
    getDatesInRange,
    getDayRange,
    getLocalizedDayNames,
    getLocalizedMonthsNames,
    getMonthDisplayRange,
    getMonthRange,
    getWeekRange,
    isDateInRange,
    isDateOutOfMonthRange,
    MONTHS_IN_TRIMESTER,
} from './calendarUtils';
import { chunk } from 'lodash';
import clsx from 'clsx';
import { add, format, isToday, set } from 'date-fns';
import { LuChevronLeft } from 'react-icons/lu';
import { LuChevronRight } from 'react-icons/lu';
import { Card, CardContent, Button, ClickAwayListener, IconButton, Theme, Typography } from '@mui/material';
import { DateRange } from './types';

export const DatePicker = ({
    handleDageChangeOnClose = false,
    handleDateChange,
    options: paramsOptions,
    selectionMode,
    opened,
    setOpened,
    selectedDate: paramsSelectedDate = new Date(),
}: DatePickerProps) => {
    const options = getOptions(paramsOptions);

    const [selectedDate, setSelectedDate] = useState<Date>(paramsSelectedDate);
    const [displayedDate, setDisplayedDate] = useState<Date>(paramsSelectedDate);

    const selectedDateRange: DateRange = useMemo(() => {
        if (selectionMode === 'day') {
            return getDayRange(selectedDate);
        } else if (selectionMode === 'week') {
            return getWeekRange(selectedDate, options);
        }
        return getMonthRange(selectedDate);
    }, [selectedDate, selectionMode]);

    useEffect(() => {
        if (handleDageChangeOnClose) {
            return;
        }
        handleDateChange(selectedDate, selectedDateRange);
    }, [selectedDateRange]);

    const openedHandler = (value: boolean) => {
        if (handleDageChangeOnClose && !value) {
            handleDateChange(selectedDate, selectedDateRange);
        }
        setOpened(value);
    };

    const daysNames = getLocalizedDayNames(options);
    const displayedDateRange = getMonthDisplayRange(displayedDate, options);
    const datesRows = chunk(getDatesInRange(displayedDateRange), DAYS_IN_WEEK);

    const monthsNames = getLocalizedMonthsNames();
    const monthRows = chunk(monthsNames, MONTHS_IN_TRIMESTER);

    const displayPrevMonth = () => setDisplayedDate((formerDate) => add(formerDate, { months: -1 }));
    const displayNextMonth = () => setDisplayedDate((formerDate) => add(formerDate, { months: 1 }));

    const displayPrevYear = () => setDisplayedDate((formerDate) => add(formerDate, { years: -1 }));
    const displayNextYear = () => setDisplayedDate((formerDate) => add(formerDate, { years: 1 }));

    const assignDate = (date: Date) => () => setSelectedDate(date);
    const assignMonth = (month: number, year: number) => () => {
        if (selectionMode === 'month') {
            return setSelectedDate((formerDate) => set(formerDate, { month, year }));
        }
        setDisplayedDate((formerDate) => set(formerDate, { month }));
    };

    if (!opened) {
        return null;
    }
    return (
        <ClickAwayListener onClickAway={() => openedHandler(false)}>
            <Card className={classLabels.root} sx={calendarSx(options)} elevation={4}>
                <CardContent className={classLabels.container}>
                    {selectionMode !== 'month' && (
                        <section className={clsx([classLabels.picker, classLabels.dayPicker])}>
                            <header>
                                <Typography className={classLabels.headerTitle}>
                                    {format(displayedDate, 'MMMM yyyy')}
                                </Typography>
                                <IconButton aria-label="Previous month" onClick={displayPrevMonth}>
                                    <LuChevronLeft size="18" />
                                </IconButton>
                                <IconButton aria-label="Next month" onClick={displayNextMonth}>
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
                                                <td key={`week_${rowIndex}_week`} className={classLabels.isWeekNumber}>
                                                    {format(row[0], 'w', { weekStartsOn: options.weekStartsOn })}
                                                </td>
                                            )}
                                            {row.map((date, dateIndex) => (
                                                <td
                                                    key={`week_${rowIndex}_${dateIndex}`}
                                                    onClick={assignDate(date)}
                                                    className={clsx({
                                                        [classLabels.isOutOfRange]: isDateOutOfMonthRange(
                                                            date,
                                                            displayedDate,
                                                        ),
                                                        [classLabels.isToday]: isToday(date),
                                                        [classLabels.isSelected]: isDateInRange(
                                                            date,
                                                            selectedDateRange,
                                                        ),
                                                    })}
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
                    <section className={clsx([classLabels.picker, classLabels.monthPicker])}>
                        <header>
                            <Typography className={classLabels.headerTitle}>{format(displayedDate, 'yyyy')}</Typography>
                            <IconButton aria-label="Previous year" onClick={displayPrevYear}>
                                <LuChevronLeft size="18" />
                            </IconButton>
                            <IconButton aria-label="Next year" onClick={displayNextYear}>
                                <LuChevronRight size="18" />
                            </IconButton>
                        </header>
                        <table>
                            <tbody>
                                {monthRows.map((monthRow, monthRowIndex) => (
                                    <tr key={`months_${monthRowIndex}`}>
                                        {monthRow.map((monthName, monthNameIndex) => {
                                            const monthIndex = monthRowIndex * MONTHS_IN_TRIMESTER + monthNameIndex;
                                            return (
                                                <td
                                                    key={`month_${monthName}`}
                                                    className={clsx({
                                                        [classLabels.isSelected]:
                                                            selectionMode === 'month' &&
                                                            selectedDate.getMonth() === monthIndex &&
                                                            displayedDate.getFullYear() === selectedDate.getFullYear(),
                                                    })}
                                                >
                                                    <Button
                                                        variant="text"
                                                        fullWidth
                                                        onClick={assignMonth(monthIndex, displayedDate.getFullYear())}
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
        dayPickerWidth: 320,
        monthPickerWidth: 320,
        ...paramsOptions,
    } as DatePickerOptions);

export type DatePickerProps = {
    handleDateChange: (date: Date, range: DateRange) => void;
    handleDageChangeOnClose?: boolean;
    opened: boolean;
    options?: Partial<DatePickerOptions>;
    selectionMode: 'day' | 'week' | 'month';
    selectedDate?: Date;
    setOpened: (opened: boolean) => void;
};

export type DatePickerOptions = {
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    showWeekNumber: boolean;
    dayPickerWidth: number;
    monthPickerWidth: number;
};

const classLabels = {
    root: 'datepicker-root',
    container: 'datepicker-container',
    picker: 'datepicker-picker',
    monthPicker: 'datepicker-monthPicker',
    dayPicker: 'datepicker-dayPicker',
    headerTitle: 'datepicker-headerTitle',
    isToday: 'datepicker-isToday',
    isOutOfRange: 'datepicker-isOutOfRange',
    isWeekNumber: 'datepicker-weekNumber',
    isSelected: 'datepicker-isSelected',
} as const;

const calendarSx = (options: DatePickerOptions) => (theme: Theme) => ({
    [`&.${classLabels.root}`]: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        display: 'inline-block',
        userSelect: 'none',
        p: 2,
    },
    [`.${classLabels.container}`]: {
        display: 'flex',
        [`section.${classLabels.dayPicker}`]: {
            position: 'relative',
            width: `${options.dayPickerWidth}px`,
            flexBasis: `${options.dayPickerWidth}px`,
            flexGrow: 0,
            flexShrink: 0,
        },
        [`section.${classLabels.monthPicker}`]: {
            position: 'relative',
            width: `${options.monthPickerWidth}px`,
            flexBasis: `${options.monthPickerWidth}px`,
            flexGrow: 0,
            flexShrink: 0,
        },
    },
    [`section.${classLabels.picker} header`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    [`section.${classLabels.picker} header .${classLabels.headerTitle}`]: {
        flex: '1 1 auto',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        textAlign: 'center',
        p: 0,
        pl: 0.5,
        m: 0,
    },
    [`.${classLabels.root} header button`]: {
        flex: '0 0 auto',
    },
    [`section.${classLabels.picker} table`]: {
        width: '100%',
        borderCollapse: 'collapse',
        td: {
            py: 0.25,
            px: 0.5,
        },
    },
    [`section.${classLabels.dayPicker} table td`]: {
        width: `calc(100% / ${DAYS_IN_WEEK + (options.showWeekNumber ? 1 : 0)})`,
        textAlign: 'right',
    },
    [`section.${classLabels.picker} td`]: {
        borderBottom: '1px solid',
        borderBottomColor: 'grey.200',
        cursor: 'pointer',
        py: '3px',
        px: 0.75,
        [`&.${classLabels.isOutOfRange}`]: {
            opacity: 0.5,
        },
        [`&.${classLabels.isWeekNumber}`]: {
            fontWeight: 'bold',
            textAlign: 'left',
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
    [`.${classLabels.monthPicker} td`]: {
        width: `calc(100% / ${MONTHS_IN_TRIMESTER})`,
        button: {
            minWidth: 'unset',
            p: 0,
            color: 'text.primary',
        },
        [`&.${classLabels.isSelected} button`]: {
            backgroundColor: 'primary.light',
        },
    },
});
