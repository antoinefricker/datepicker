import { Box, Stack, Typography, ThemeProvider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker, DatePickerOptions, DatePickerProps } from './datePicker/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { defaultTheme } from './theme/theme';
import { de, enGB, fr, type Locale } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from './datePicker/types';

export const App = () => {
    const [selectionMode, setSelectionMode] = useState<DatePickerProps['selectionMode']>('day');
    const [_date, setDate] = useState<Date>(new Date());
    const [opened, setOpened] = useState<boolean>(false);
    const [range, setRange] = useState<DateRange | null>(null);

    const handleDateChange = (date: Date, range: DateRange | null) => {
        setDate(date);
        setRange(range);
    };

    const rangeLabel = (() => {
        if (!range) {
            return 'No range selected';
        }
        if (selectionMode === 'day') {
            return format(range.start, DATE_FORMAT);
        }
        if (selectionMode === 'week') {
            return `Week #${format(range.start, 'w', { weekStartsOn: calendarOptions.weekStartsOn })}`;
        }
        if (selectionMode === 'month') {
            return format(range.start, 'MMMM yyyy');
        }
    })();

    const dateLocale = 'fr';
    return (
        <ThemeProvider theme={defaultTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocales[dateLocale]}>
                <Stack direction="column" spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="selectionModeLabel" shrink>
                            Selection mode
                        </InputLabel>
                        <Select<DatePickerProps['selectionMode']>
                            required
                            labelId="selectionModeLabel"
                            value={selectionMode}
                            onChange={(event) =>
                                setSelectionMode(event.target.value as DatePickerProps['selectionMode'])
                            }
                            variant="outlined"
                        >
                            <MenuItem value="day">day</MenuItem>
                            <MenuItem value="week">week</MenuItem>
                            <MenuItem value="month">month</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ pt: 5 }}>
                        <Typography variant="h6" gutterBottom onClick={() => setOpened(true)}>
                            {rangeLabel}
                        </Typography>
                        <DatePicker
                            handleDateChange={handleDateChange}
                            opened={opened}
                            selectionMode={selectionMode}
                            setOpened={setOpened}
                            options={calendarOptions}
                        />
                    </Box>
                </Stack>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

const DATE_FORMAT = 'dd/MM/yyyy';
const calendarOptions: Partial<DatePickerOptions> = {
    weekStartsOn: 6,
    showWeekNumber: true,
    dayPickerWidth: 300,
    monthPickerWidth: 260,
};

type UILocale = 'fr' | 'de' | 'en';

const dateLocales: Record<UILocale, Locale> = { fr, de, en: enGB };
