import React, {useEffect} from 'react';
import { Box, Typography, Grid2 as Grid, ListItem, ListItemText} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useHookstate } from '@hookstate/core';  // Hookstate hook
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
          label: "Future Value",
          data: yearlyData.map((data) => data.value),
          borderColor: themeColorState.get().primary,
          backgroundColor: themeColorState.get().secondary,
        },
      ],
    });
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
    console.log(totalInvested);
    const futureValue = result.get();
    const totalEarned = futureValue - totalInvested;

    console.log(totalEarned);
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


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        }).format(value);
    };

  const ResultItem = ({ primary, secondary }) => (
    <ListItem alignItems="flex-start">
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
        
        <ResultItem primary={formatCurrency(result.get())} secondary={"Future Value"} />
        </Grid>
        <Grid size={6}>
        <ResultItem primary={formatPercentage(calculateFinalInterestRate())} secondary={"Time-weighted return"} />
        </Grid>
        <Grid size={6}>
        
        <ResultItem primary={formatCurrency(calculateTotalEarned())} secondary={"Total earned"} />
        </Grid>
        <Grid size={6}>
        
        <ResultItem primary={formatCurrency(calculateTotalInvested())} secondary={"Total Invested"} />
        </Grid>
      </Grid>
        </Box>
      )}
      {Object.keys(chartData.get()).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Line data={chartData.get({noproxy: true})} />
        </Box>
      )}
    </>
  );
};

export default CompoundCalResult;