import Grid from '@mui/material/Grid/Grid';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import Slider from '@mui/material/Slider/Slider';
import TextField from '@mui/material/TextField/TextField';
import {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {formatPrice, numberToRupeesInWords} from '../../helpers/price';
import './styles.css';
import Button from '@mui/material/Button/Button';

const SIPCalculator = () => {
    const [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
    const [initialInvestment, setInitialInvestment] = useState('');
    const [monthlyInvestment, setMonthlyInvestment] = useState('');
    const [returnsExpected, setReturnsExpected] = useState('8');
    const [expenseRatio, setExpenseRatio] = useState('0');
    const [investmentPeriodYears, setInvestmentPeriodYears] = useState('20');
    const [inflationRate, setInflationRate] = useState('0');
    const [stepupPercentage, setStepupPercentage] = useState('0');
    const [totalInvested, setTotalInvested] = useState('0');
    const [estimatedReturns, setEstimatedReturns] = useState('0');
    const [inflationAdjustedValue, setInflationAdjustedValue] = useState('0');

    const calculateSIPReturns = useCallback(() => {
        const principal = parseFloat(initialInvestment) || 0;
        const monthlyContribution = parseFloat(monthlyInvestment) || 0;
        const rateOfReturn = parseFloat(returnsExpected) / 100 / 12 || 0;
        const expenseRatioMonthly = parseFloat(expenseRatio) / 100 / 12 || 0;
        const inflationRateAnnual = parseFloat(inflationRate) / 100 || 0;
        const stepUpRate = parseFloat(stepupPercentage) / 100 || 0;
        const totalMonths = parseInt(investmentPeriodYears) * 12;

        let totalInvestedAmount = principal;
        let futureValue = principal;
        let monthlyStepUp = monthlyContribution;

        for (let month = 1; month <= totalMonths; month++) {
            totalInvestedAmount += monthlyStepUp;
            futureValue = (futureValue + monthlyStepUp) * (1 + rateOfReturn - expenseRatioMonthly);

            if (month % 12 === 0) {
                monthlyStepUp *= 1 + stepUpRate;
            }
        }

        const inflationAdjustedValue = (
            futureValue / Math.pow(1 + inflationRateAnnual, parseInt(investmentPeriodYears))
        ).toString();
        setTotalInvested(totalInvestedAmount.toFixed(2));
        setEstimatedReturns((futureValue - totalInvestedAmount).toFixed(2));
        setInflationAdjustedValue(inflationAdjustedValue);
    }, [
        expenseRatio,
        inflationRate,
        initialInvestment,
        investmentPeriodYears,
        monthlyInvestment,
        returnsExpected,
        stepupPercentage
    ]);

    const handleMonthlyInvestmentSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setMonthlyInvestment(newValue.toString());
    }, []);

    const handleInitialInvestmentSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setInitialInvestment(newValue.toString());
    }, []);

    const handleReturnsExpectedSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setReturnsExpected(newValue.toString());
    }, []);

    const handleExpenseRatioSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setExpenseRatio(newValue.toString());
    }, []);

    const handleInvestmentPeriodYearsSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setInvestmentPeriodYears(newValue.toString());
    }, []);

    const handleInflationRateSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setInflationRate(newValue.toString());
    }, []);

    const handleStepupPercentageSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setStepupPercentage(newValue.toString());
    }, []);

    const handleMonthlyInvestmentChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setMonthlyInvestment(e.target.value);
        },
        []
    );

    const handleInitialInvestmentChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setInitialInvestment(e.target.value);
        },
        []
    );

    const handleReturnsExpectedChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setReturnsExpected(e.target.value);
        },
        []
    );

    const handleExpenseRatioChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setExpenseRatio(e.target.value);
        },
        []
    );

    const handleInvestmentPeriodYearsChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setInvestmentPeriodYears(e.target.value);
        },
        []
    );

    const handleInflationRateChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setInflationRate(e.target.value);
        },
        []
    );

    const handleStepupPercentageChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
            e?.target.value && setStepupPercentage(e.target.value);
        },
        []
    );

    const toggleAdvanceOptions = useCallback(() => setShowAdvanceOptions((show) => !show), []);

    useEffect(() => {
        calculateSIPReturns();
    }, [
        initialInvestment,
        monthlyInvestment,
        returnsExpected,
        expenseRatio,
        investmentPeriodYears,
        stepupPercentage,
        calculateSIPReturns
    ]);

    return (
        <div className="elevated-container addPurchase-container">
            <h2>SIP Calculator</h2>
            <form className="add-purchase-form">
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="input-group">
                            <TextField
                                className="transaction-item-element"
                                label="Monthly Investment"
                                variant="outlined"
                                value={monthlyInvestment}
                                placeholder="5000"
                                onChange={handleMonthlyInvestmentChange}
                                fullWidth
                            />
                            <Slider
                                defaultValue={parseInt(monthlyInvestment)}
                                value={parseInt(monthlyInvestment)}
                                step={1000}
                                min={0}
                                max={100000}
                                onChange={handleMonthlyInvestmentSliderChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="input-group">
                            <TextField
                                className="transaction-item-element"
                                label="Returns expected"
                                variant="outlined"
                                value={returnsExpected}
                                placeholder="12.5"
                                onChange={handleReturnsExpectedChange}
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            />
                            <Slider
                                defaultValue={parseFloat(returnsExpected)}
                                value={parseFloat(returnsExpected)}
                                step={0.5}
                                min={0}
                                max={50}
                                onChange={handleReturnsExpectedSliderChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="input-group">
                            <TextField
                                className="transaction-item-element"
                                label="Investment Period (years)"
                                variant="outlined"
                                value={investmentPeriodYears}
                                placeholder="10"
                                onChange={handleInvestmentPeriodYearsChange}
                                fullWidth
                            />
                            <Slider
                                defaultValue={parseInt(investmentPeriodYears)}
                                value={parseFloat(investmentPeriodYears)}
                                step={1}
                                min={1}
                                max={50}
                                onChange={handleInvestmentPeriodYearsSliderChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <div className="input-group">
                            <TextField
                                className="transaction-item-element"
                                label="Initial Investment"
                                variant="outlined"
                                value={initialInvestment}
                                placeholder="10,000"
                                onChange={handleInitialInvestmentChange}
                                fullWidth
                            />
                            <Slider
                                defaultValue={parseInt(initialInvestment)}
                                value={parseInt(initialInvestment)}
                                step={5000}
                                min={0}
                                max={1000000}
                                onChange={handleInitialInvestmentSliderChange}
                            />
                        </div>
                    </Grid>
                </Grid>

                <Button
                    className="secondary-button center"
                    variant="outlined"
                    onClick={toggleAdvanceOptions}
                    sx={{width: 'auto'}}
                    size="small"
                >
                    {showAdvanceOptions ? 'Hide Advance Options' : 'Show Advance Options'}
                </Button>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {showAdvanceOptions && (
                        <>
                            <Grid item xs={12} sm={6} md={3}>
                                <div className="input-group">
                                    <TextField
                                        className="transaction-item-element"
                                        label="Expense Ratio"
                                        variant="outlined"
                                        value={expenseRatio}
                                        placeholder="5"
                                        onChange={handleExpenseRatioChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }}
                                    />
                                    <Slider
                                        defaultValue={parseFloat(expenseRatio)}
                                        value={parseFloat(expenseRatio)}
                                        step={0.1}
                                        min={0}
                                        max={5}
                                        onChange={handleExpenseRatioSliderChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <div className="input-group">
                                    <TextField
                                        className="transaction-item-element"
                                        label="Inflation Rate"
                                        variant="outlined"
                                        value={inflationRate}
                                        placeholder="5"
                                        onChange={handleInflationRateChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }}
                                    />
                                    <Slider
                                        defaultValue={parseFloat(inflationRate)}
                                        value={parseFloat(inflationRate)}
                                        step={0.5}
                                        min={0}
                                        max={15}
                                        onChange={handleInflationRateSliderChange}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <div className="input-group">
                                    <TextField
                                        className="transaction-item-element"
                                        label="Stepup Percentage"
                                        variant="outlined"
                                        value={stepupPercentage}
                                        placeholder="5"
                                        onChange={handleStepupPercentageChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                                        }}
                                    />
                                    <Slider
                                        defaultValue={parseFloat(stepupPercentage)}
                                        value={parseFloat(stepupPercentage)}
                                        step={1}
                                        min={0}
                                        max={20}
                                        onChange={handleStepupPercentageSliderChange}
                                    />
                                </div>
                            </Grid>
                        </>
                    )}
                </Grid>
                <div className="sipCalculator-result-container">
                    <div className="sipCalculator-result-row">
                        <span>Maturity Amount: </span>
                        <div className="sipCalculator-result-amount">
                            <div>₹ {formatPrice(parseInt(totalInvested) + parseInt(estimatedReturns), 0)}</div>
                            <div>({numberToRupeesInWords(parseInt(totalInvested) + parseInt(estimatedReturns))})</div>
                        </div>
                    </div>
                    <div className="sipCalculator-result-row">
                        <span>Total Invested: </span>
                        <div className="sipCalculator-result-amount">
                            <div>₹ {formatPrice(parseInt(totalInvested), 0)}</div>
                            <div>({numberToRupeesInWords(parseInt(totalInvested))})</div>
                        </div>
                    </div>
                    <div className="sipCalculator-result-row">
                        <span>Estimated Profit: </span>
                        <div className="sipCalculator-result-amount">
                            <div>₹ {formatPrice(parseInt(estimatedReturns), 0)}</div>
                            <div>({numberToRupeesInWords(parseInt(estimatedReturns))})</div>
                        </div>
                    </div>
                    <div className="sipCalculator-result-row">
                        <span>Inflation Adjusted Total: </span>
                        <div className="sipCalculator-result-amount">
                            <div>₹ {formatPrice(parseInt(inflationAdjustedValue), 0)}</div>
                            <div>({numberToRupeesInWords(parseInt(inflationAdjustedValue))})</div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SIPCalculator;
