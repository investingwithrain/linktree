import React, {useEffect} from 'react';
import { Box, Typography, Grid2 as Grid, ListItem, ListItemText, IconButton} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { useHookstate } from '@hookstate/core';  // Hookstate hook
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {
    initialInvestmentState,
    yearlyInterestState,
    monthlyInvestmentState,
    numberOfYearsState,
    resultState,
    chartDataState,
    setResult,
    setChartData,
    themeColorState,
  } from '../data/compoundState';
const CompoundCalResult = () => {
    const initialInvestment = useHookstate(initialInvestmentState);
    const yearlyInterest = useHookstate(yearlyInterestState);
    const monthlyInvestment = useHookstate(monthlyInvestmentState);
    const numberOfYears = useHookstate(numberOfYearsState);
    const result = useHookstate(resultState);
    const chartData = useHookstate(chartDataState);

  const calculateCompoundInterest = () => {
    const initialInvestmentValue = initialInvestment.get();  // Get the value
    const yearlyInterestValue = yearlyInterest.get();
    const monthlyInvestmentValue = monthlyInvestment.get();
    const numberOfYearsValue = numberOfYears.get();

    if (
      initialInvestmentValue === "" ||
      yearlyInterestValue === "" ||
      monthlyInvestmentValue === "" ||
      numberOfYearsValue === ""
    ) {
      setResult(null);
      setChartData({});
      return;
    }

    

    const monthlyRate = yearlyInterestValue / 100 / 12;
    const months = numberOfYearsValue * 12;
    let futureValue = initialInvestmentValue;
    const yearlyData = [{ year: 0, value: initialInvestmentValue }];

    for (let i = 1; i <= months; i++) {
      futureValue = futureValue * (1 + monthlyRate) + monthlyInvestmentValue;
      if (i % 12 === 0) {
        yearlyData.push({ year: i / 12, value: futureValue.toFixed(2) });
      }
    }

    setResult(futureValue.toFixed(2));
    setChartData({
      labels: yearlyData.map((data) => data.year),
      datasets: [
        {
          label: "未來價值",
          data: yearlyData.map((data) => data.value, true),
          borderColor: themeColorState.get().primary,
          backgroundColor: themeColorState.get().secondary,
        },
      ],
    });
  };

  const chartOptions = {
    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return formatCurrency(value, false);
                }
            }
        },
    }
};


  var totalInvested;
  var totalEarned;

  const calculateTotalInvested = () => {
    const initialInvestmentValue = initialInvestment.get();
    const monthlyInvestmentValue = monthlyInvestment.get();
    const numberOfYearsValue = numberOfYears.get();

    totalInvested = initialInvestmentValue + monthlyInvestmentValue * numberOfYearsValue * 12;
    return totalInvested;
  }

  const calculateTotalEarned = () => {
    if(!totalInvested)
        totalInvested = calculateTotalInvested();
    const futureValue = result.get();
    const totalEarned = futureValue - totalInvested;

    return totalEarned;
  }

  const calculateFinalInterestRate = () => {
    if(!totalInvested)
        totalInvested = calculateTotalInvested();
    if(!totalEarned)
        totalEarned = calculateTotalEarned();
    const finalInterestRate = (totalEarned / totalInvested) * 100;
    return finalInterestRate;
  }

  // Perform the calculation during render

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialInvestment, yearlyInterest, monthlyInvestment, numberOfYears]);


  const formatCurrency = (value, decimal) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimal ? 2:0,
      maximumFractionDigits: decimal ? 2:0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        }).format(value);
    };


  const handleClick = () => {
    navigator.clipboard.writeText(formatCurrency(result));
    alert('Copied to clipboard!');
  };

  const ResultItem = ({ primary, secondary }) => (
    <ListItem alignItems="flex-start"
    secondaryAction={
      <IconButton edge="end" aria-label="copy" onClick={handleClick}>
        <ContentCopyIcon sx={{scale:0.7}}/>
      </IconButton>
    }
    >
      <ListItemText
        primary={<Typography
            component="span"
            variant="h5"
            sx={{ color: 'text.primary', display: 'inline' }}
          >{primary}</Typography>}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'grey', display: 'inline' }}
            >
              {secondary}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );


  return (
    <>
      {result.get() && (
        <Box sx={{ mt: 4 }}>
          {/* <Typography variant="h5" component="h2" color="black">
            Future Value: {formatCurrency(result.get())}
          </Typography> */}
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={6}>
        
        <ResultItem primary={formatCurrency(result.get(), true)} secondary={"本利和 （總未來價值）"} />
        </Grid>
        <Grid size={6}>
        <ResultItem primary={formatPercentage(calculateFinalInterestRate())} secondary={"複息回報率"} />
        </Grid>
        <Grid size={6}>
        
        <ResultItem primary={formatCurrency(calculateTotalEarned(), true)} secondary={"總利息收入"} />
        </Grid>
        <Grid size={6}>
        
        <ResultItem primary={formatCurrency(calculateTotalInvested(), true)} secondary={"總投入資本"} />
        </Grid>
      </Grid>
        </Box>
      )}
      {Object.keys(chartData.get()).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Bar data={chartData.get({noproxy: true})} options={chartOptions} />
        </Box>
      )}
    </>
  );
};

export default CompoundCalResult;