import { response } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private filterTransactionsByType(type: string): Transaction[] {
    const transactions = this.transactions.filter(
      transaction => transaction.type === type,
    );

    return transactions;
  }

  private getTransactionsTotal(transactions: Transaction[]): number {
    const transactionTotal = transactions.reduce((total, transaction) => {
      const valuesSum = total + transaction.value;

      return valuesSum;
    }, 0);

    return transactionTotal;
  }

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.filterTransactionsByType('income');
    const outcomeTransactions = this.filterTransactionsByType('outcome');

    const incomeTotal = this.getTransactionsTotal(incomeTransactions);
    const outcomeTotal = this.getTransactionsTotal(outcomeTransactions);

    const balance = {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
