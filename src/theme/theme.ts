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
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.MuiInputLabel-shrink': {
                        backgroundColor: 'white',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        transform: `translate(8px, -10px) scale(0.75)`,
                    },
                },
            },
        },
    },
});
