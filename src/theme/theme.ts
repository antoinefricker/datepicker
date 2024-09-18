import createPalette from '@mui/material/styles/createPalette';
import { createTheme } from '@mui/material';

export const defaultTheme = createTheme({
    shape: {
        borderRadius: 2,
    },
    typography: {
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 17,
        button: {
            textTransform: 'none',
        },
    },
    palette: {
        ...createPalette({
            primary: {
                main: '#54afb2',
                contrastText: '#eeeee7',
            },
            secondary: {
                main: '#403e3b',
                contrastText: '#eeeee7',
            },
            error: {
                main: '#e55e5e',
                contrastText: '#eeeee7',
            },
            warning: {
                main: '#bd904c',
                contrastText: '#eeeee7',
            },
            success: {
                main: '#54afb2',
                contrastText: '#eeeee7',
            },
        }),
    },
});
