import React from 'react';
import { useCurrencyConverter } from './hooks/useCurrencyConverter';
import ConverterForm from './components/ConverterForm';
import { AppContainer } from './components/SharedStyles';

function App() {
  const viewModel = useCurrencyConverter();

  return (
    <AppContainer>
      <h2>Conversor de Moedas</h2>
      <ConverterForm {...viewModel} />
    </AppContainer>
  );
}

export default App;