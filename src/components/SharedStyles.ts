import styled from 'styled-components';

export const AppContainer = styled.div`
  max-width: 650px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 20px;
  align-items: end;
  margin-bottom: 25px;
`;

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
`;

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