export interface Currency {
  id: string; 
  name: string; 
  symbol: string;
}

export interface CurrenciesResponse {
  data: {
    [key: string]: Currency; 
  };
}

export interface RateResponse {
  data: {
    [targetCurrency: string]: number; 
  };
}

export interface ConversionForm {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string; 
}