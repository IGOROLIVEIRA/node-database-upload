import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Categoy from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transationsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Categoy);
    let categoryExits = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExits) {
      categoryExits = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryExits);
    }

    const balance = await transationsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Transaction invalid! Outcome > total');
    }
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type invalid!');
    }
    const transaction = await transationsRepository.create({
      title,
      value,
      type,
      category: categoryExits,
    });
    await transationsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
