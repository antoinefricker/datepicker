import { useState } from 'react';
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
} from './calendarUtils';
import { chunk } from 'lodash';
import { LuCalendar } from 'react-icons/lu';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { LuChevronLeft } from 'react-icons/lu';
import { LuChevronRight } from 'react-icons/lu';
import { DumbDatePickerClassLabels as classLabels } from './DumbDatePickerClassLabels';
import { Box, Stack } from '@mui/material';

export const DumbDatePicker = () => {
    const [selectedDate, _setSelectedDate] = useState(new Date());

    const displayedDateRange = getMonthDisplayRange(selectedDate);
    const datesInRange = getDatesInRange(displayedDateRange);
    const rows = chunk(datesInRange, DAYS_IN_WEEK);
    const daysNames = getLocalizedDayNames();
    const monthsNames = getLocalizedMonthsNames();

    return (
        <Box className={classLabels.root} sx={calendarSx}>
            <Stack direction="row" spacing={1} className={classLabels.header}>
                <LuCalendar />
                <LuChevronLeft />
                {selectedDate.toDateString()}
                <LuChevronRight />
            </Stack>
            <section className={classLabels.browsers}>
                <div className={classLabels.calendarBrowser}>
                    <div className={classLabels.calendarRow} key={`daynames`}>
                        {daysNames.map((dayName) => (
                            <div className={classLabels.calendarCell} key={`day_${dayName}`}>
                                {dayName}
                            </div>
                        ))}
                    </div>
                    {rows.map((row, rowIndex) => (
                        <div className={classLabels.calendarRow} key={`week_${rowIndex}`}>
                            <div className={classLabels.weekNumber}></div>
                            {row.map((date) => (
                                <div
                                    className={clsx({
                                        [classLabels.calendarCell]: true,
                                        [classLabels.isOutOfRange]: isDateOutOfMonthRange(date, selectedDate),
                                        [classLabels.isToday]: isToday(date),
                                    })}
                                    key={`day_${getDateGroupKey(date)}`}
                                >
                                    {date.getDate()}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={classLabels.monthsBrowser}>
                    <div className={classLabels.monthsContainer}>
                        {monthsNames.map((monthName) => (
                            <div className={classLabels.monthCell} key={`month_${monthName}`}>
                                {monthName}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Box>
    );
};

const calendarSx = {
    [`&.${classLabels.root}`]: {
        position: 'relative',
        width: ROOT_WIDTH,
        border: 'red 1px solid',
    },
    [`.${classLabels.header}`]: {
        width: '100%',
        border: 'green 1px solid',
    },
    [`.${classLabels.browsers}`]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        border: 'yellow 1px solid',
    },
    [`.${classLabels.monthsBrowser}`]: {
        flex: '50% 0 0',
    },
    [`.${classLabels.monthsContainer}`]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    [`.${classLabels.monthCell}`]: {
        flex: '33% 0 0',
    },
    [`.${classLabels.calendarBrowser}`]: {
        flex: '50% 0 0',
    },
    [`.${classLabels.calendarRow}`]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    [`.${classLabels.calendarCell}`]: {
        position: 'relative',
        flex: '1 1 100%',
        width: `calc((100% / ${DAYS_IN_WEEK + (SHOW_WEEK_NUMBER ? 1 : 0)}))`,
    },
};
