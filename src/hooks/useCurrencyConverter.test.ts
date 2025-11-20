import { test, describe, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react'; 
import * as apiService from '../services/currencyApi';
import { useCurrencyConverter } from './useCurrencyConverter'; 
import * as yup from 'yup'; 
import { format } from 'date-fns';
import type { CurrenciesResponse } from '../types';



type DateFnsFormat = typeof format;

vi.mock('date-fns', async (importOriginal) => {
  const mod = await importOriginal() as { format: DateFnsFormat };
  
  return {
    ...mod,
    format: vi.fn((date, formatStr) => {
      if (formatStr === 'yyyy-MM-dd') return '2025-11-20'; 
      
      // Otherwise, use the original implementation
      return mod.format(date, formatStr);
    }),
  };
});

const MAX_DATE = format(new Date(), 'yyyy-MM-dd'); 

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .required('The amount is required.')
    .positive('The amount must be a positive number.')
    .test(
        'max-two-decimals', 
        'The amount can have a maximum of 2 decimal places.',
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
    )
    .typeError('The value must be a valid number.'),
  fromCurrency: yup.string().required('Select the source currency.'),
  toCurrency: yup.string().required('Select the target currency.'),
  date: yup
    .string()
    .nullable()
    .test('not-in-future', 'The date cannot be in the future.', (value) => !value || value <= MAX_DATE),
});


const getCurrenciesSpy = vi.spyOn(apiService, 'getCurrencies');
const getConversionRateSpy = vi.spyOn(apiService, 'getConversionRate');

const mockCurrencies: CurrenciesResponse['data'] = {
  USD: { code: 'USD', name: 'US Dollar' },
  BRL: { code: 'BRL', name: 'Brazilian Real' },
};

const mockRateResponse = {
  data: {
    BRL: { value: 5.25 },
  },
};

describe('Form Validation (Yup Schema)', () => {
  const validData = {
    amount: 100.55,
    fromCurrency: 'USD',
    toCurrency: 'BRL',
    date: '2025-11-15',
  };

  test('should pass validation for valid data', async () => {
    await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
  });

  test('should fail if amount is missing', async () => {
    const data = { ...validData, amount: undefined };
    await expect(validationSchema.validateAt('amount', data)).rejects.toHaveProperty('message', 'The amount is required.');
  });

  test('should fail if amount is zero or negative', async () => {
    const data = { ...validData, amount: 0 };
    await expect(validationSchema.validateAt('amount', data)).rejects.toHaveProperty('message', 'The amount must be a positive number.');
  });

  test('should fail if amount has more than 2 decimal places', async () => {
    const data = { ...validData, amount: 100.123 };
    await expect(validationSchema.validateAt('amount', data)).rejects.toHaveProperty('message', 'The amount can have a maximum of 2 decimal places.');
  });

  test('should pass if date is null (optional)', async () => {
    const data = { ...validData, date: null };
    await expect(validationSchema.validate(data)).resolves.toEqual(data);
  });

  test('should fail if date is in the future', async () => {
    // MAX_DATE is fixed ('2025-11-20'), so '2025-11-21' must fail
    const data = { ...validData, date: '2025-11-21' }; 
    await expect(validationSchema.validateAt('date', data)).rejects.toHaveProperty('message', 'The date cannot be in the future.');
  });
});

describe('useCurrencyConverter Core Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getConversionRateSpy.mockClear();
  });

  test('should load currencies on initial mount', async () => {
    getCurrenciesSpy.mockResolvedValue({ data: mockCurrencies });

    const { result } = renderHook(() => useCurrencyConverter());

    await waitFor(() => expect(result.current.availableCurrencies.length).toBe(2));

    expect(result.current.availableCurrencies[0].code).toBe('USD');
    expect(result.current.generalError).toBeNull();
  });

  test('should handle API error during currency loading', async () => {
    getCurrenciesSpy.mockRejectedValue(new Error('API key failed'));

    const { result } = renderHook(() => useCurrencyConverter());

    await waitFor(() => expect(result.current.generalError).not.toBeNull());

    expect(result.current.availableCurrencies.length).toBe(0);
    expect(result.current.generalError).toBe('API key failed');
  });

  test('should swap currencies and clear result', async () => {
    getConversionRateSpy.mockResolvedValue(mockRateResponse);
    const { result } = renderHook(() => useCurrencyConverter());
    
    act(() => {
        result.current.handleChange('amount', 10);
        result.current.handleChange('fromCurrency', 'USD');
        result.current.handleChange('toCurrency', 'BRL');
    });

    await act(async () => {
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        await result.current.handleConversion(mockEvent);
    });
    
    expect(result.current.conversionResult).toBe('52.50 BRL'); 

    act(() => {
      result.current.handleSwap();
    });

    expect(result.current.formData.fromCurrency).toBe('BRL');
    expect(result.current.formData.toCurrency).toBe('USD');
    expect(result.current.conversionResult).toBeNull(); 
  });

  test('should clear result when any input changes', async () => {
    getConversionRateSpy.mockResolvedValue(mockRateResponse);
    const { result } = renderHook(() => useCurrencyConverter());
    
    act(() => {
        result.current.handleChange('amount', 10);
        result.current.handleChange('fromCurrency', 'USD');
        result.current.handleChange('toCurrency', 'BRL');
    });

    await act(async () => {
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        await result.current.handleConversion(mockEvent);
    });
    
    expect(result.current.conversionResult).toBe('52.50 BRL'); 

    act(() => {
      result.current.handleChange('amount', 50);
    });

    expect(result.current.conversionResult).toBeNull(); 
  });
});

describe('handleConversion (Success and Calculation)', () => {

   beforeEach(() => {
    vi.clearAllMocks();
    getConversionRateSpy.mockClear();
  });
  
  test('should calculate conversion correctly for latest rate', async () => {
    getConversionRateSpy.mockResolvedValue(mockRateResponse);

    const { result } = renderHook(() => useCurrencyConverter());
    
    act(() => {
        result.current.handleChange('amount', 100);
        result.current.handleChange('fromCurrency', 'USD');
        result.current.handleChange('toCurrency', 'BRL');
        // Uses the mocked date
        result.current.handleChange('date', '2025-11-20'); 
    });
    
    await act(async () => {
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        await result.current.handleConversion(mockEvent);
    });

    expect(getConversionRateSpy).toHaveBeenCalledWith('USD', 'BRL', undefined); 
    
    expect(result.current.conversionResult).toBe('525.00 BRL');
    expect(result.current.isLoading).toBe(false);
  });

  test('should format result to 2 decimal places even with complex rates', async () => {
    const complexRateResponse = {
      data: {
        GBP: { value: 0.82345678 },
      },
    };
    getConversionRateSpy.mockResolvedValue(complexRateResponse);

    const { result } = renderHook(() => useCurrencyConverter());
    
    act(() => {
        result.current.handleChange('amount', 3);
        result.current.handleChange('fromCurrency', 'USD');
        result.current.handleChange('toCurrency', 'GBP');
        result.current.handleChange('date', '2025-11-15');
    });
    
    await act(async () => {
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        await result.current.handleConversion(mockEvent);
    });
    
    expect(getConversionRateSpy).toHaveBeenCalledWith('USD', 'GBP', '2025-11-15');
    expect(result.current.conversionResult).toBe('2.47 GBP');
  });

  test('should show validation errors and stop conversion', async () => {
    const { result } = renderHook(() => useCurrencyConverter());
    
    act(() => {
        result.current.handleChange('amount', -5);
    });
    
    await act(async () => {
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
        await result.current.handleConversion(mockEvent);
    });

    expect(getConversionRateSpy).not.toHaveBeenCalled();
    expect(result.current.validationErrors.amount).toBe('The amount must be a positive number.');
    expect(result.current.isLoading).toBe(false);
  });
});