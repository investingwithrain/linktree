import React from 'react';
import { TextField, Typography, Tooltip, Container, Box, Button, Slider, InputAdornment } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useHookstate } from '@hookstate/core';  // Hookstate hook
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { themeColorState, initialInvestmentState, yearlyInterestState, monthlyInvestmentState, numberOfYearsState, setInitialInvestment, setYearlyInterest, setMonthlyInvestment, setNumberOfYears, resetToInitValue  } from '../data/compoundState';
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

        <Box sx={{ mb: 2 }}>
          <TextField
            label="Initial Investment"
            type="number"
            fullWidth
            sx={CssTextField}
            value={initialInvestment.get()}  // Access the value
            onChange={(e) => {

                if (e.target.value === "") {
                    setInitialInvestment("");
                }else{
                    setInitialInvestment(Number(e.target.value));
                }
            }}
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
            onChange={(e) => {

                if (e.target.value === "") {
                    setYearlyInterest("");
                }else{
                    setYearlyInterest(Number(e.target.value));
                }
            }}
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
            onChange={(e) => {
                if (e.target.value === "") {
                    setMonthlyInvestment("");
                }else{
                    setMonthlyInvestment(Number(e.target.value));
                }
            }}
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
            onChange={(e) => {

                if (e.target.value === "") {
                    setNumberOfYears("");
                }else{
                    setNumberOfYears(Number(e.target.value));
                }
            }}
            margin="normal"
          />
        </Box>
          <Slider
            value={numberOfYears.get()}
            onChange={handleSliderChange}
            aria-labelledby="number-of-years-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value===1? `${value} year`:`${value} years`}
            sx={{ color: themeColorState.get().primary }}
            step={1}
            marks
            min={1}
            max={100}
          />
        <CompoundCalResult />
        <br />
        <br />
        <Tooltip title="Reset">

        <Button variant="text" style={{ color: themeColorState.get().primary }} onClick={resetToInitValue}>
          <RestartAltIcon sx={{scale: 1.5}}/>
        </Button>
        </Tooltip>
        <br />
        <br />
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default CompoundCal;