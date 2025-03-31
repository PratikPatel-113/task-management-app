import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: {
                        main: '#1976d2',
                    },
                    background: {
                        default: '#f4f4f4',
                        paper: '#ffffff',
                    },
                    text: {
                        primary: '#333',
                        secondary: '#555',
                    },
                }
                : {
                    primary: {
                        main: '#90caf9',
                    },
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                    },
                    text: {
                        primary: '#1976d2',
                        secondary: '#aaaaaa',
                    },
                }),
        },
        typography: {
            fontFamily: 'Arial, sans-serif',
            h1: {
                fontSize: '2rem',
                fontWeight: 600,
            },
            h2: {
                fontSize: '1.5rem',
                fontWeight: 500,
            },
        },
    });