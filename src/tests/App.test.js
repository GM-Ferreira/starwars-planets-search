import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Testes da aplicação', () => {
  test('Testa se a tela inicial é renderizada', async () => {
    render(<App />);
    const titleElement = screen.getByText(/STAR WARS/i);
    const inputText = screen.getByRole('textbox');
    const columnSelector = screen.getByRole('combobox', {  name: /column:/i});
    const operatorSelector = screen.getByRole('combobox', {  name: /operator:/i});
    const numberSelector = screen.getByRole('spinbutton');
    const filterButton = screen.getByRole('button', {  name: /filtrar/i});
    const removeFiltersButton = screen.getByRole('button', {  name: /remover filtros/i});
    const loadingElement = screen.getByText(/Loading.../i);

    expect(titleElement).toBeInTheDocument();
    expect(inputText).toBeInTheDocument();
    expect(columnSelector).toBeInTheDocument();
    expect(operatorSelector).toBeInTheDocument();
    expect(numberSelector).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    expect(removeFiltersButton).toBeInTheDocument();
    expect(loadingElement).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i), {timeout: 9000});

    const columName = screen.getByRole('columnheader', {  name: /name/i});
    const columRotation = screen.getByRole('columnheader', {  name: /rotation_period/i});
    const columOrbital = screen.getByRole('columnheader', {  name: /orbital_period/i});
    const columDiameter = screen.getByRole('columnheader', {  name: /diameter/i});
    const columClimate = screen.getByRole('columnheader', {  name: /climate/i});
    const firstCellElement = screen.getByRole('cell', {  name: /tatooine/i});

    expect(columName).toBeInTheDocument();
    expect(columRotation).toBeInTheDocument();
    expect(columOrbital).toBeInTheDocument();
    expect(columDiameter).toBeInTheDocument();
    expect(columClimate).toBeInTheDocument();
    expect(firstCellElement).toBeInTheDocument();

  }, 10000);

  test('Testa se é possível digitar no forms e clicar nos filtros', async () => {
    render(<App />);
    
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i), {timeout: 9000});

    const inputText = screen.getByRole('textbox');
    const columnSelector = screen.getByRole('combobox', {  name: /column:/i});
    const operatorSelector = screen.getByRole('combobox', {  name: /operator:/i});
    const numberSelector = screen.getByRole('spinbutton');
    const filterButton = screen.getByRole('button', {  name: /filtrar/i});
    const removeFiltersButton = screen.getByRole('button', {  name: /remover filtros/i});

    userEvent.type(inputText, 'aa');
    userEvent.selectOptions(columnSelector, 'orbital_period');
    userEvent.type(numberSelector, '10');
    userEvent.selectOptions(operatorSelector, 'menor que');
    userEvent.click(filterButton);
    userEvent.click(removeFiltersButton);

    userEvent.type(inputText, 'a');
    userEvent.type(numberSelector, '350');
    userEvent.selectOptions(columnSelector, 'orbital_period');
    userEvent.selectOptions(operatorSelector, 'maior que');
    userEvent.click(filterButton);

    await waitFor(() => screen.getAllByRole('button', {  name: /remover/i})[1]);
    
    const removeOneFilter = screen.getAllByRole('button', {  name: /remover/i});

    expect(removeOneFilter[1]).toBeInTheDocument();

    userEvent.click(removeOneFilter[1]);

  }, 10000);

  test('Testa se é possível adicionar três filtros e remover todos um por um', async () => {
    render(<App />);
    
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i), {timeout: 9000});

    const columnSelector = screen.getByRole('combobox', {  name: /column:/i});
    const operatorSelector = screen.getByRole('combobox', {  name: /operator:/i});
    const numberSelector = screen.getByRole('spinbutton');
    const filterButton = screen.getByRole('button', {  name: /filtrar/i});

    userEvent.selectOptions(columnSelector, 'orbital_period');
    userEvent.selectOptions(operatorSelector, 'maior que');
    userEvent.type(numberSelector, '350');
    userEvent.click(filterButton);

    userEvent.selectOptions(columnSelector, 'diameter');
    userEvent.selectOptions(operatorSelector, 'menor que');
    userEvent.type(numberSelector, '20000');
    userEvent.click(filterButton);

    userEvent.selectOptions(columnSelector, 'surface_water');
    userEvent.selectOptions(operatorSelector, 'igual a');
    userEvent.type(numberSelector, '8');
    userEvent.click(filterButton);

    await waitFor(() => screen.getAllByRole('button', {  name: /remover/i})[1]);
    
    const removeOneFilter = screen.getAllByRole('button', {  name: /remover/i});

    expect(removeOneFilter).toHaveLength(4);
    
    userEvent.click(removeOneFilter[3]);
    userEvent.click(removeOneFilter[2]);
    userEvent.click(removeOneFilter[1]);

  }, 10000);

  test('Testa se é possível remover apenas o segundo filtros de três', async () => {
    render(<App />);
    
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i), {timeout: 9000});

    const columnSelector = screen.getByRole('combobox', {  name: /column:/i});
    const operatorSelector = screen.getByRole('combobox', {  name: /operator:/i});
    const numberSelector = screen.getByRole('spinbutton');
    const filterButton = screen.getByRole('button', {  name: /filtrar/i});
    
    userEvent.selectOptions(columnSelector, 'diameter');
    userEvent.selectOptions(operatorSelector, 'menor que');
    userEvent.type(numberSelector, '20000');
    userEvent.click(filterButton);
    
    userEvent.selectOptions(columnSelector, 'surface_water');
    userEvent.selectOptions(operatorSelector, 'igual a');
    userEvent.type(numberSelector, '8');
    userEvent.click(filterButton);
    
    userEvent.selectOptions(columnSelector, 'rotation_period');
    userEvent.selectOptions(operatorSelector, 'igual a');
    userEvent.type(numberSelector, '24');
    userEvent.click(filterButton);

    userEvent.selectOptions(columnSelector, 'orbital_period');
    userEvent.selectOptions(operatorSelector, 'maior que');
    userEvent.type(numberSelector, '350');
    userEvent.click(filterButton);

    await waitFor(() => screen.getAllByRole('button', {  name: /remover/i})[1]);
    
    const removeOneFilter = screen.getAllByRole('button', {  name: /remover/i});

    expect(removeOneFilter).toHaveLength(5);
    
    userEvent.click(removeOneFilter[4]);

  }, 10000);

  test('Testa se é possível ordenar os planetas', async () => {
    render(<App />);
    
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i), {timeout: 9000});

    const sortBySelection = screen.getByTestId('column-sort');
    const sortByRuleAsc = screen.getByRole('radio', {  name: /asc/i});
    const sortByRuleDesc = screen.getByRole('radio', {  name: /desc/i})
    const sortByButton = screen.getByRole('button', {  name: /sort/i});
    
    expect(sortBySelection).toBeInTheDocument();
    expect(sortByRuleAsc).toBeInTheDocument();
    expect(sortByRuleDesc).toBeInTheDocument();
    expect(sortByButton).toBeInTheDocument();

    userEvent.selectOptions(sortBySelection, 'diameter');
    userEvent.click(sortByRuleAsc);
    userEvent.click(sortByButton);

    const planetList = screen.queryAllByTestId('planet-name');

    expect(planetList).toHaveLength(10);

    expect(planetList[0]).toHaveAccessibleName('Endor');

    userEvent.click(sortByRuleDesc);
    userEvent.click(sortByButton);

    const planetListNew = screen.queryAllByTestId('planet-name');

    expect(planetListNew[0]).toHaveAccessibleName('Bespin');

  }, 10000);

})
