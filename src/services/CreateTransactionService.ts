import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const validTypes = ['income', 'outcome'];

    if (!validTypes.includes(type)) {
      throw Error('Transaction type does not match our system valid types.');
    }

    if (type === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();
      const finalValue = total - value;

      if (finalValue < 0) {
        throw Error('You do not have this ammount of money, man');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
