export type TransactionType = 'expenses' | 'incomes';

export type CategoryType = "Groceries" | "Salary" | "Entertainment" | "etc" | string;

export type DefaultTransactionType = {
  name: string,
  amount: number;
  category: CategoryType,
  type: TransactionType,
  date: Date
}

export type ExpensesTransactionType = DefaultTransactionType;

export type IncomesTransactionType = DefaultTransactionType;
