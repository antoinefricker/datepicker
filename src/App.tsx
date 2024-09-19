import {
    Box,
    Stack,
    Grid2 as Grid,
    Typography,
    ThemeProvider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DatePicker, DatePickerProps } from './datePicker/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { defaultTheme } from './theme/theme';
import { de, enGB, fr, type Locale } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from './datePicker/types';

export const App = () => {
    const [selectionMode, setSelectionMode] = useState<DatePickerProps['selectionMode']>('day');
    const [date, setDate] = useState<Date>(new Date());
    const [range, setRange] = useState<DateRange | null>(null);

    const handleDateChange = (date: Date, range: DateRange | null) => {
        setDate(date);
        setRange(range);
    };

    const dateLocale = 'fr';
    return (
        <ThemeProvider theme={defaultTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocales[dateLocale]}>
                <Stack direction="column" gap={1}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Typography>Selected date: {format(date, DATE_FORMAT)}</Typography>
                        </Grid>
                        {range && (
                            <Grid size={6}>
                                <Typography>
                                    Selected range: {format(range.start, DATE_FORMAT)} -{' '}
                                    {format(range.end, DATE_FORMAT)}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
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
                        <DatePicker
                            isStatic
                            handleDateChange={handleDateChange}
                            selectionMode={selectionMode}
                            options={{
                                weekStartsOn: 6,
                                showWeekNumber: true,
                                rootWidth: 640,
                            }}
                        />
                    </Box>
                </Stack>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

const DATE_FORMAT = 'dd/MM/yyyy';

type UILocale = 'fr' | 'de' | 'en';

const dateLocales: Record<UILocale, Locale> = { fr, de, en: enGB };
