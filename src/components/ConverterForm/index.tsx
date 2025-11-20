// src/components/ConverterForm/index.tsx
import React from 'react';
import type { Currency, ConversionForm } from '../../types';
import { 
  FormGrid, 
  FormField, 
  Select, 
  SwapButton, 
  Input, 
  SubmitButton, 
  ErrorMessage, 
  ResultBox,
  AmountField, // Componente que define o layout do campo Valor
  DateField     // Componente que define o layout do campo Data
} from '../SharedStyles';
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
    // Garante que 'amount' é tratada como número (ou string vazia)
    const processedValue = name === 'amount' ? (value === '' ? '' : Number(value)) : value;
    handleChange(name, processedValue);
  };
  
  return (
    <>
      {/* Erro Geral (API falhou ou outro problema global) */}
      {generalError && !Object.keys(validationErrors).length && (
        <ErrorMessage>{generalError}</ErrorMessage>
      )}

      <FormGrid onSubmit={handleConversion}>
        {/* 1. SELETOR FROM (1ª coluna, 1ª linha) */}
        <FormField>
          <label htmlFor="fromCurrency">De:</label>
          <Select 
            id="fromCurrency" 
            name="fromCurrency" 
            value={formData.fromCurrency} 
            onChange={handleInputChange} 
            disabled={availableCurrencies.length === 0}
          >
            {availableCurrencies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
          </Select>
          {validationErrors.fromCurrency && <ErrorMessage>{validationErrors.fromCurrency}</ErrorMessage>}
        </FormField>

        {/* 2. BOTÃO SWAP (2ª coluna, 1ª linha) */}
        <SwapButton type="button" onClick={handleSwap} aria-label="Trocar moedas de origem e destino">
          ⇅
        </SwapButton>

        {/* 3. SELETOR TO (3ª coluna, 1ª linha) */}
        <FormField>
          <label htmlFor="toCurrency">Para:</label>
          <Select 
            id="toCurrency" 
            name="toCurrency" 
            value={formData.toCurrency} 
            onChange={handleInputChange} 
            disabled={availableCurrencies.length === 0}
          >
            {availableCurrencies.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
          </Select>
          {validationErrors.toCurrency && <ErrorMessage>{validationErrors.toCurrency}</ErrorMessage>}
        </FormField>
        
        {/* 4. INPUT DE VALOR (AMOUNT) - Usa AmountField para ocupar 2 colunas no desktop */}
        <AmountField> 
          <label htmlFor="amount">Valor (Até 2 casas decimais):</label>
          <Input 
            id="amount" 
            name="amount" 
            type="text" 
            value={String(formData.amount)} 
            onChange={handleInputChange} 
            required 
            placeholder="Ex: 100.50"
          />
          {validationErrors.amount && <ErrorMessage>{validationErrors.amount}</ErrorMessage>}
        </AmountField>

        {/* 5. INPUT DE DATA (OPCIONAL) - Usa DateField para ocupar a 3ª coluna no desktop */}
        <DateField> 
          <label htmlFor="date">Data (Opcional):</label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            value={formData.date || ''} 
            onChange={handleInputChange} 
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          {validationErrors.date && <ErrorMessage>{validationErrors.date}</ErrorMessage>}
        </DateField>

        {/* 6. BOTÃO DE SUBMISSÃO - Ocupa a largura total (1 / -1) */}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '10px' }}>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Converter'}
          </SubmitButton>
        </div>

      </FormGrid>

      {/* EXIBIÇÃO DO RESULTADO */}
      {conversionResult && (
        <ResultBox>
          {formData.amount} {formData.fromCurrency} = **{conversionResult}**
        </ResultBox>
      )}
    </>
  );
};

export default ConverterForm;