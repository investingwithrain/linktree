import React from 'react';
import { TextField, Typography, Container, Box, Button, Slider, InputAdornment } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useHookstate } from '@hookstate/core';  // Hookstate hook
import { initialInvestmentState, yearlyInterestState, monthlyInvestmentState, numberOfYearsState, setInitialInvestment, setYearlyInterest, setMonthlyInvestment, setNumberOfYears, resetToInitValue  } from '../data/compoundState';
import CompoundCalResult from './CompoundCalResult';

const CompoundCal = () => {
    const initialInvestment = useHookstate(initialInvestmentState);
    const yearlyInterest = useHookstate(yearlyInterestState);
    const monthlyInvestment = useHookstate(monthlyInvestmentState);
    const numberOfYears = useHookstate(numberOfYearsState);



    const handleSliderChange = (event, newValue) => {
        setNumberOfYears(newValue);
      };

      const theme = createTheme({
        typography: {
          allVariants: {
            fontFamily: 'MElleHK-Xbold',
            textTransform: 'none',
          },
        },
      });


  // Declare the const and add the material UI style
  const CssTextField = {
      '& label.Mui-focused': {
        color: 'grey',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'grey',
        },
        '&:hover fieldset': {
          borderColor: 'grey',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        },
      },
    };

  return (
    <ThemeProvider theme={theme}>

    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {/* <Typography variant="h4" component="h1" color="black"  gutterBottom>
          Compound Calculator
        </Typography> */}

        <br />
        <br />
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Initial Investment"
            type="number"
            fullWidth
            sx={CssTextField}
            value={initialInvestment.get()}  // Access the value
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            margin="normal"
            slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Yearly Interest (%)"
            type="number"
            fullWidth
            sx={CssTextField}
            value={yearlyInterest.get()}
            onChange={(e) => setYearlyInterest(Number(e.target.value))}
            margin="normal"
            slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">%</InputAdornment>,
                },
              }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Monthly Investment"
            type="number"
            fullWidth
            sx={CssTextField}
            value={monthlyInvestment.get()}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            margin="normal"
            slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Number of Years"
            type="number"
            fullWidth
            sx={CssTextField}
            value={numberOfYears.get()}
            onChange={(e) => setNumberOfYears(Number(e.target.value))}
            margin="normal"
          />
        </Box>
          <Slider
            value={numberOfYears.get()}
            onChange={handleSliderChange}
            aria-labelledby="number-of-years-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value===1? `${value} year`:`${value} years`}
            sx={{ color: '#ee9b00' }}
            step={1}
            marks
            min={1}
            max={100}
          />
        <CompoundCalResult />
        <br />
        <br />
        <Button variant="contained" style={{ backgroundColor: '#ee9b00', color: '#001219' }} onClick={resetToInitValue}>
          Reset
        </Button>
        <br />
        <br />
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default CompoundCal;