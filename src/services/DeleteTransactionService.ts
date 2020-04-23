import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transationsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transationsRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction does not exits.');
    }
    await transationsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
