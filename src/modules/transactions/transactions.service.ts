import { Prisma } from '@/generated/prisma';
import { CreateBody, UpdateBody } from './transactions.schemas';
import { TransactionsRepository } from './transactions.repository';

export class TransactionsService {
  constructor(private repo: TransactionsRepository) {}

  list(userId: string) {
    return this.repo.list(userId);
  }

  get(userId: string, id: string) {
    return this.repo.getById(userId, id);
  }

  create(userId: string, dto: CreateBody) {
    const amount = new Prisma.Decimal(dto.amount.toFixed(2));
    return this.repo.create(userId, {
      ...dto,
      amount,
      userId: '',
    });
  }

  update(userId: string, id: string, dto: UpdateBody) {
    const data: any = { ...dto };
    if (dto.amount !== undefined) data.amount = new Prisma.Decimal(dto.amount.toFixed(2));
    return this.repo.update(userId, id, data);
  }

  delete(userId: string, id: string) {
    return this.repo.delete(userId, id);
  }
}
