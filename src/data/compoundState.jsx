import { hookstate } from '@hookstate/core';

// Create individual global states using hookstate
export const initialInvestmentState = hookstate(300);
export const yearlyInterestState = hookstate(10);
export const monthlyInvestmentState = hookstate(300);
export const numberOfYearsState = hookstate(15);
export const resultState = hookstate(null);
export const chartDataState = hookstate({});

// Create functions for setting values directly if needed
export const setInitialInvestment = (value) => {
  initialInvestmentState.set(value);
};

export const setYearlyInterest = (value) => {
  yearlyInterestState.set(value);
};

export const setMonthlyInvestment = (value) => {
  monthlyInvestmentState.set(value);
};

export const setNumberOfYears = (value) => {
  numberOfYearsState.set(value);
};

export const setResult = (value) => {
  resultState.set(value);
};

export const setChartData = (value) => {
  chartDataState.set(value);
};

export const resetToInitValue = () => {
  initialInvestmentState.set(300);
  yearlyInterestState.set(10);
  monthlyInvestmentState.set(300);
  numberOfYearsState.set(15);
}