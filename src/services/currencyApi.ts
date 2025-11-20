import currencyApi from './apiClient'; 
import type { CurrenciesResponse, RateResponse } from '../types';

export async function getCurrencies(): Promise<CurrenciesResponse> {
  try {
    const response = await currencyApi.get<CurrenciesResponse>('/currencies');
    return response.data;
  } catch (error) {
    console.error("Error to search avaiable coins:", error);
    throw new Error('Error to load coins, check your api key');
  }
}

export async function getConversionRate(
  from: string,
  to: string,
  date?: string
): Promise<RateResponse> {
  const endpoint = date ? '/historical' : '/latest';
  
  try {
    const response = await currencyApi.get<RateResponse>(endpoint, {
      params: {
        base_currency: from,
        currencies: to,
        date: date, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error to search conversion tax:", error);
    throw new Error('Error to load conversion tax');
  }
}