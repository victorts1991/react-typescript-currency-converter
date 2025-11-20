export interface Currency {
  id: string; 
  name: string; 
  code: string;
}

export interface ConversionRateValue {
  value: number;
}

export interface CurrenciesResponse {
  data: {
    [key: string]: Currency; 
  };
}

export interface RateResponse {
  data: {
    [targetCurrency: string]: ConversionRateValue;
  };
}

export interface ConversionForm {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string; 
}