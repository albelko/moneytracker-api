import { Prisma, PrismaClient } from '@/generated/prisma';

export class TransactionsRepository {
  constructor(private prisma: PrismaClient) {}

  list(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: 50,
    });
  }

  getById(userId: string, id: string) {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: Prisma.TransactionUncheckedCreateInput) {
    return this.prisma.transaction.create({ data: { ...data, userId } });
  }

  update(userId: string, id: string, data: Prisma.TransactionUncheckedUpdateInput) {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  delete(userId: string, id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
