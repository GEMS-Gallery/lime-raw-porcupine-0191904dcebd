import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
        setFirstOperand(null);
        setOperation(null);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Display>
          {display}
          {loading && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </Display>
        <Grid container spacing={1}>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <CalculatorButton
                fullWidth
                variant="contained"
                onClick={() => handleNumberClick(btn)}
              >
                {btn}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleBackspace}
            >
              <BackspaceIcon />
            </CalculatorButton>
          </Grid>
          {['+', '-', '*', '/'].map((op) => (
            <Grid item xs={3} key={op}>
              <CalculatorButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleOperationClick(op)}
              >
                {op}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClear}
            >
              C
            </CalculatorButton>
          </Grid>
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleEqualsClick}
            >
              =
            </CalculatorButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
