// src/components/SharedStyles.ts
import styled from 'styled-components';

// --- 1. Container Principal ---
export const AppContainer = styled.div`
  max-width: 650px;
  width: 95%; 
  margin: 0 auto; 
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  background-color: #ffffff; 

  @media (max-width: 700px) {
    width: 90%; 
    padding: 20px;
  }
`;

// --- 2. Elementos Básicos de Formulário ---
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  height: 40px;

  white-space: nowrap;      /* Impede quebra de linha dentro do select */
  overflow: hidden;         /* Esconde o texto que ultrapassa o limite */
  text-overflow: ellipsis;  /* Adiciona "..." ao final do texto (se suportado pelo navegador) */
  width: 100%;
`;

// --- 3. Botão Swap (Dependência do FormGrid) ---
export const SwapButton = styled.button`
  grid-column: 2;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  height: 40px;
  font-size: 1.5em;
  color: #333;
  transition: transform 0.2s;
  &:hover {
    transform: rotate(180deg);
  }
`;

// --- 4. Componentes de Layout para Campos Específicos (NOVOS) ---

// Campo de Valor: Ocupa 2 colunas no desktop
export const AmountField = styled(FormField)`
  grid-column: 1 / 3;
  
  @media (max-width: 500px) {
    grid-column: auto; /* Ocupa 100% da coluna única em mobile */
  }
`;

// Campo de Data: Ocupa a 3ª coluna no desktop
export const DateField = styled(FormField)`
  grid-column: 3 / 4;
  
  @media (max-width: 500px) {
    grid-column: auto; /* Ocupa 100% da coluna única em mobile */
    order: 4; /* Garante que venha após o Swap em telas pequenas */
  }
`;


// --- 5. Grade do Formulário (FormGrid) ---
export const FormGrid = styled.form`
  display: grid;
  /* Layout Desktop (três colunas: De | Swap | Para) */
  grid-template-columns: 1fr 40px 1fr;
  gap: 20px;
  align-items: end;
  margin-bottom: 25px;

  /* --- Responsividade da Grade --- */
  @media (max-width: 500px) {
    /* Layout Mobile (uma única coluna) */
    grid-template-columns: 1fr; 
    gap: 15px;
    align-items: stretch; 
    
    /* Reposiciona o botão Swap no fluxo de 1 coluna */
    ${SwapButton} {
      grid-column: auto; 
      order: 3;         
      margin: 10px auto;
    }
    
    /* O div de submissão (botão Converter) também precisa ser ajustado */
    > div:last-child {
      grid-column: auto;
    }
  }
`;

// --- 6. Outros Elementos ---
export const SubmitButton = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #a0c3e6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: #d9534f;
  margin-top: 5px;
  font-size: 0.85em;
`;

export const ResultBox = styled.div`
  padding: 15px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  text-align: center;
  font-size: 1.3em;
  font-weight: bold;
  margin-top: 20px;
`;