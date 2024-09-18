import { useEffect, useState } from 'react';
import {
    DAYS_IN_WEEK,
    getDateGroupKey,
    getDatesInRange,
    getLocalizedDayNames,
    getLocalizedMonthsNames,
    getMonthDisplayRange,
    isDateOutOfMonthRange,
    ROOT_WIDTH,
    SHOW_WEEK_NUMBER,
    WEEK_STARTS_ON,
} from './calendarUtils';
import { chunk } from 'lodash';
import clsx from 'clsx';
import { add, format, isToday, set } from 'date-fns';
import { LuChevronLeft } from 'react-icons/lu';
import { LuChevronRight } from 'react-icons/lu';
import { Button, Card, CardContent, ClickAwayListener, IconButton, Theme, Typography } from '@mui/material';

export const DatePicker = ({ handleDateChange, isStatic }: DatePickerProps) => {
    const [opened, setOpened] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        handleDateChange(selectedDate);
    }, [selectedDate]);

    const openedHandler = (value: boolean) => setOpened(value || !!isStatic);

    const daysNames = getLocalizedDayNames();
    const displayedDateRange = getMonthDisplayRange(selectedDate);
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
            <Card elevation={4} className={classLabels.root} sx={calendarSx}>
                <CardContent>
                    <div className={classLabels.browsers}>
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
                                        {SHOW_WEEK_NUMBER && <td className={classLabels.isWeekNumber}>#</td>}
                                        {daysNames.map((dayName) => (
                                            <td key={`day_${dayName}`}>{dayName}</td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {datesRows.map((row, rowIndex) => (
                                        <tr key={`week_${rowIndex}`}>
                                            {SHOW_WEEK_NUMBER && (
                                                <td className={classLabels.isWeekNumber}>
                                                    {format(row[0], 'w', { weekStartsOn: WEEK_STARTS_ON })}
                                                </td>
                                            )}
                                            {row.map((date) => (
                                                <td
                                                    className={clsx({
                                                        [classLabels.isOutOfRange]: isDateOutOfMonthRange(
                                                            date,
                                                            selectedDate,
                                                        ),
                                                        [classLabels.isToday]: isToday(date),
                                                    })}
                                                    key={`day_${getDateGroupKey(date)}`}
                                                >
                                                    <Button
                                                        variant="text"
                                                        sx={{
                                                            color: 'text.primary',
                                                            minWidth: 'auto',
                                                            minHeight: 'auto',
                                                            py: 0.25,
                                                            px: 0.75,
                                                        }}
                                                        onClick={reachDate(date)}
                                                    >
                                                        {date.getDate()}
                                                    </Button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
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
                                            {monthRow.map((monthName, monthNameIndex) => (
                                                <td key={`month_${monthName}`}>
                                                    <Button
                                                        variant="text"
                                                        sx={{ color: 'text.primary' }}
                                                        onClick={reachMonth(monthRowIndex * 4 + monthNameIndex)}
                                                    >
                                                        {monthName}
                                                    </Button>
                                                </td>
                                            ))}
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

type DatePickerProps = {
    isStatic?: boolean;
    handleDateChange: (date: Date) => void;
};

const classLabels = {
    root: 'ddp-calendarContainer',
    browsers: 'ddp-browsers',
    monthPicker: 'ddp-monthPicker',
    dayPicker: 'ddp-dayPicker',
    isToday: 'ddp--isToday',
    isOutOfRange: 'ddp--isOutOfRange',
    isWeekNumber: 'ddp-weekNumber',
} as const;

const calendarSx = (theme: Theme) => ({
    [`&.${classLabels.root}`]: {
        position: 'relative',
        width: ROOT_WIDTH,
        fontFamily: theme.typography.fontFamily,
        fontSize: '1rem',
        '& .MuiCardContent-root': {
            p: 1,
        },
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
        width: `calc(100% / ${DAYS_IN_WEEK + (SHOW_WEEK_NUMBER ? 1 : 0)})`,
        py: 0.25,
        px: 0.5,
        textAlign: 'right',
    },
    [`.${classLabels.browsers} .${classLabels.dayPicker} table tr td`]: {
        borderBottom: '1px solid',
        borderBottomColor: 'grey.200',
        [`&.${classLabels.isOutOfRange}`]: {
            opacity: 0.5,
        },
        [`&.${classLabels.isWeekNumber}`]: {
            fontWeight: 'bold',
            textAlign: 'left',
            backgroundColor: 'grey.200',
        },
        [`&.${classLabels.isToday}`]: {
            borderBottomWidth: 2,
            borderBottomColor: 'primary.main',
        },
    },
    [`.${classLabels.browsers} .${classLabels.monthPicker} table td`]: {
        width: `calc(100% / 4)`,
        px: 0.25,
        py: 0.25,
    },
});
