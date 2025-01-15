import React, {useEffect} from 'react';
import { Box, Typography } from '@mui/material';
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
          borderColor: "#ee9b00",
          backgroundColor: "rgba(238,155,0,0.2)",
        },
      ],
    });
  };

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

  return (
    <>
      {result.get() && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" color="black">
            Future Value: {formatCurrency(result.get())}
          </Typography>
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