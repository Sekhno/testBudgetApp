import {DefaultTransactionType} from '../models/TransactionsTypes';

export function saveTransActions(transactions: DefaultTransactionType[])
{
  localStorage.setItem('[TRANSACTIONS]', JSON.stringify(transactions));
}

export function retrieveTransActions()
{
  const value = localStorage.getItem('[TRANSACTIONS]');

  if (!value) return [] as DefaultTransactionType[];
  else return JSON.parse(value) as DefaultTransactionType[];
}

export function saveCategories(categories: string[])
{
  localStorage.setItem('[CATEGORIES]', JSON.stringify(categories));
}

export function retrieveCategories()
{
  const value = localStorage.getItem('[CATEGORIES]');

  if (!value) return ["Groceries", "Salary", "Entertainment"] as string[];
  else return JSON.parse(value) as string[];
}
