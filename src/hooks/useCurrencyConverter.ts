import { useState, useEffect, useCallback } from 'react';
import type { Currency, ConversionForm } from '../types';
import { getCurrencies, getConversionRate } from '../services/currencyApi';
import * as yup from 'yup';
import { format } from 'date-fns';

const MAX_DATE = format(new Date(), 'yyyy-MM-dd');

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .required('The amount is required.')
    .positive('The amount must be a positive number.')
    .test(
        'max-two-decimals', 
        'The amount can have a maximum of 2 decimal places.',
        (value) => /^-?\d+(\.\d{1,2})?$/.test(String(value))
    )
    .typeError('The value must be a valid number.'),
  fromCurrency: yup.string().required('Select the source currency.'),
  toCurrency: yup.string().required('Select the target currency.'),
  date: yup
    .string()
    .nullable()
    .test('not-in-future', 'The date cannot be in the future.', (value) => !value || value <= MAX_DATE),
});

export const useCurrencyConverter = () => {
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([]);
  const [formData, setFormData] = useState<ConversionForm>({
    amount: 1,
    fromCurrency: 'USD',
    toCurrency: 'BRL',
    date: MAX_DATE,
  });
  
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const response = await getCurrencies();
        const currenciesArray = Object.values(response.data);
        setAvailableCurrencies(currenciesArray);
        setGeneralError(null);
      } catch (err) {
        setGeneralError((err as Error).message);
      }
    }
    loadCurrencies();
  }, []);

  const handleChange = useCallback((name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setConversionResult(null)
    if (validationErrors[name]) {
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  }, [validationErrors]);

  const handleSwap = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
    }));
    setConversionResult(null)
  }, []);

  const handleConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);
    setValidationErrors({});
    setConversionResult(null);

    try {
      const validatedData = await validationSchema.validate(formData, { abortEarly: false });
      
      const dateParam = (validatedData.date === null || validatedData.date === MAX_DATE) 
        ? undefined 
        : validatedData.date;

      const rateResponse = await getConversionRate(
        validatedData.fromCurrency,
        validatedData.toCurrency,
        dateParam
      );

      const targetRate = rateResponse.data[validatedData.toCurrency].value;
      console.log('Target Rate:', targetRate);

      if (targetRate === undefined) {
        throw new Error('Could not find the conversion rate.');
      }
      
      const resultValue = validatedData.amount * targetRate;
      const formattedResult = resultValue.toFixed(2); 

      setConversionResult(`${formattedResult} ${validatedData.toCurrency}`);

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach(error => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
        
      } else {
        setGeneralError((err as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    availableCurrencies,
    conversionResult,
    isLoading,
    generalError,
    validationErrors,
    handleChange,
    handleSwap,
    handleConversion,
  };
};