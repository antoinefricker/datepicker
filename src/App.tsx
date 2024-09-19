import { Box, Typography, ThemeProvider } from '@mui/material';
import { DatePicker } from './datePicker/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { defaultTheme } from './theme/theme';
import { de, enGB, fr, type Locale } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useState } from 'react';
import { format } from 'date-fns';

export const App = () => {
    const [date, setDate] = useState<Date>(new Date());
    const dateLocale = 'fr';
    return (
        <ThemeProvider theme={defaultTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocales[dateLocale]}>
                <Typography>{format(date, 'dd/MM/yyyy')}</Typography>
                <Box sx={{ p: 10 }}>
                    <DatePicker
                        isStatic
                        handleDateChange={(date) => setDate(date)}
                        selectionMode="day"
                        options={{
                            weekStartsOn: 6,
                            showWeekNumber: true,
                            rootWidth: 640,
                        }}
                    />
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

type UILocale = 'fr' | 'de' | 'en';

const dateLocales: Record<UILocale, Locale> = { fr, de, en: enGB };
