import React from 'react';
import type { Currency, ConversionForm } from '../../types';
import { FormGrid, FormField, Select, SwapButton, Input, SubmitButton, ErrorMessage, ResultBox } from '../SharedStyles';
import { format } from 'date-fns';

interface ConverterFormProps {
  formData: ConversionForm;
  availableCurrencies: Currency[];
  conversionResult: string | null;
  isLoading: boolean;
  generalError: string | null;
  validationErrors: Record<string, string>;
  
  handleChange: (name: string, value: string | number) => void;
  handleSwap: () => void;
  handleConversion: (e: React.FormEvent) => Promise<void>;
}

const ConverterForm: React.FC<ConverterFormProps> = ({
  formData, availableCurrencies, conversionResult, isLoading, generalError, validationErrors,
  handleChange, handleSwap, handleConversion
}) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'amount' ? (value === '' ? '' : Number(value)) : value;
    handleChange(name, processedValue);
  };
  
  return (
    <>
      {generalError && !Object.keys(validationErrors).length && (
        <ErrorMessage>{generalError}</ErrorMessage>
      )}

      <FormGrid onSubmit={handleConversion}>
        <FormField>
          <label htmlFor="fromCurrency">De:</label>
          <Select id="fromCurrency" name="fromCurrency" value={formData.fromCurrency} onChange={handleInputChange} disabled={availableCurrencies.length === 0}>
            {availableCurrencies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
          </Select>
          {validationErrors.fromCurrency && <ErrorMessage>{validationErrors.fromCurrency}</ErrorMessage>}
        </FormField>

        <SwapButton type="button" onClick={handleSwap} aria-label="Trocar moedas de origem e destino">⇅</SwapButton>

        <FormField>
          <label htmlFor="toCurrency">Para:</label>
          <Select id="toCurrency" name="toCurrency" value={formData.toCurrency} onChange={handleInputChange} disabled={availableCurrencies.length === 0}>
            {availableCurrencies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
          </Select>
          {validationErrors.toCurrency && <ErrorMessage>{validationErrors.toCurrency}</ErrorMessage>}
        </FormField>
        
        <FormField style={{ gridColumn: '1 / 3' }}>
          <label htmlFor="amount">Valor (Até 2 casas decimais):</label>
          <Input id="amount" name="amount" type="text" value={String(formData.amount)} onChange={handleInputChange} required placeholder="Ex: 100.50"/>
          {validationErrors.amount && <ErrorMessage>{validationErrors.amount}</ErrorMessage>}
        </FormField>

        <FormField style={{ gridColumn: '3 / 4' }}>
          <label htmlFor="date">Data (Opcional):</label>
          <Input id="date" name="date" type="date" value={formData.date || ''} onChange={handleInputChange} max={format(new Date(), 'yyyy-MM-dd')}/>
          {validationErrors.date && <ErrorMessage>{validationErrors.date}</ErrorMessage>}
        </FormField>

        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '10px' }}>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Converter'}
          </SubmitButton>
        </div>

      </FormGrid>

      {conversionResult && (
        <ResultBox>
          {formData.amount} {formData.fromCurrency} = **{conversionResult}**
        </ResultBox>
      )}
    </>
  );
};

export default ConverterForm;