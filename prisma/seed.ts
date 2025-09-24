/* eslint-disable no-console */
// prisma/seed.ts
import { PrismaClient, Prisma, AccountType, TransactionType } from '@/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

/** =========================
 *  Config (tweak safely)
 *  ========================= */
const DEMO_USER_EMAIL = 'seed@moneytracker.dev';
const DEMO_USER_NAME = 'Seed User';
const DEMO_PASSWORD_HASH = '$2b$10$examplehashexamplehashexamplehashex'; // replace in prod

// Counts
const N_ACCOUNTS = 12;
const N_EXPENSE_CATEGORIES = 10;
const N_INCOME_CATEGORIES = 4;
const N_PAYEES = 12;
const N_TRANSACTIONS = 60;

// Currencies & enums
const CURRENCIES = ['USD', 'EUR', 'RUB', 'GBP'] as const;
const ACCOUNT_TYPES: readonly AccountType[] = ['CASH', 'BANK', 'CREDIT', 'INVESTMENT', 'CRYPTO', 'OTHER'] as const;
const TX_TYPES: readonly TransactionType[] = ['EXPENSE', 'INCOME'] as const;

// Deterministic randomness for reliability across runs
faker.seed(20250924);

/** =========================
 *  Small strict-safe helpers
 *  ========================= */
function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('pick() called with empty array');
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function asMoney(n: number): Prisma.Decimal {
  // Ensure two decimals as string → Decimal, to avoid float artifacts
  return new Prisma.Decimal(n.toFixed(2));
}

/** =========================
 *  Main seeding
 *  ========================= */
async function main() {
  console.log('▶ Seeding MoneyTracker demo data…');

  // 0) Upsert the demo user
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: { name: DEMO_USER_NAME },
    create: {
      email: DEMO_USER_EMAIL,
      passwordHash: DEMO_PASSWORD_HASH,
      name: DEMO_USER_NAME,
    },
  });

  // 1) Clean previous demo data (only for this user) in FK-safe order
  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId: user.id } }),
    prisma.payee.deleteMany({ where: { userId: user.id } }),
    prisma.category.deleteMany({ where: { userId: user.id } }),
    prisma.account.deleteMany({ where: { userId: user.id } }),
  ]);

  // 2) Create Accounts (deterministic names)
  const accounts = await Promise.all(
    Array.from({ length: N_ACCOUNTS }).map((_, i) => {
      const name = `Account ${String(i + 1).padStart(2, '0')}`;
      const type = ACCOUNT_TYPES[i % ACCOUNT_TYPES.length];
      const currency = CURRENCIES[i % CURRENCIES.length];
      const balanceInitial = asMoney(faker.number.float({ min: 0, max: 5000 }));

      return prisma.account.create({
        data: { userId: user.id, name, type, currency: currency!, balanceInitial },
        select: { id: true, currency: true },
      });
    })
  );

  if (accounts.length === 0) throw new Error('No accounts were created');

  // 3) Create Categories (split: expense + income)
  const expenseCategories = await Promise.all(
    Array.from({ length: N_EXPENSE_CATEGORIES }).map((_, i) =>
      prisma.category.create({
        data: {
          userId: user.id,
          name: `Expense ${String(i + 1).padStart(2, '0')}`,
          isIncome: false,
        },
        select: { id: true, isIncome: true },
      })
    )
  );

  const incomeCategories = await Promise.all(
    Array.from({ length: N_INCOME_CATEGORIES }).map((_, i) =>
      prisma.category.create({
        data: {
          userId: user.id,
          name: `Income ${String(i + 1).padStart(2, '0')}`,
          isIncome: true,
        },
        select: { id: true, isIncome: true },
      })
    )
  );

  if (expenseCategories.length === 0 || incomeCategories.length === 0) {
    throw new Error('Need at least one expense and one income category');
  }

  // 4) Create Payees
  const payees = await Promise.all(
    Array.from({ length: N_PAYEES }).map((_, i) =>
      prisma.payee.create({
        data: {
          userId: user.id,
          name: `Payee ${String(i + 1).padStart(2, '0')}`,
          note: faker.company.catchPhrase(),
        },
        select: { id: true },
      })
    )
  );

  if (payees.length === 0) throw new Error('No payees were created');

  // 5) Create Transactions (signed amounts, type-aware categories)
  const txPromises: Promise<unknown>[] = [];
  for (let i = 0; i < N_TRANSACTIONS; i++) {
    const account = pick(accounts);
    const type = pick(TX_TYPES);

    const isIncome = type === 'INCOME';
    const catPool = isIncome ? incomeCategories : expenseCategories;
    const category = pick(catPool);
    const payee = pick(payees);

    // Amount: 5..300; negative for EXPENSE, positive for INCOME
    const unsigned = faker.number.float({ min: 5, max: 300 });
    const signed = isIncome ? Math.abs(unsigned) : -Math.abs(unsigned);

    // Date: last 120 days
    const occurredAt = faker.date.recent({ days: 120 });

    txPromises.push(
      prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: account.id,
          type,
          amount: asMoney(signed),
          currency: account.currency,
          occurredAt,
          description: isIncome ? faker.company.buzzPhrase() : faker.commerce.productName(),
          note: faker.commerce.productDescription(),
          categoryId: category.id,
          payeeId: payee.id,
        },
      })
    );
  }
  await Promise.all(txPromises);

  // 6) Report
  const [accountsCount, categoriesCount, payeesCount, transactionsCount] = await Promise.all([
    prisma.account.count({ where: { userId: user.id } }),
    prisma.category.count({ where: { userId: user.id } }),
    prisma.payee.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: { userId: user.id } }),
  ]);

  console.log(`✅ Seed complete for ${DEMO_USER_EMAIL}
  Accounts:     ${accountsCount}
  Categories:   ${categoriesCount} (expense: ${expenseCategories.length}, income: ${incomeCategories.length})
  Payees:       ${payeesCount}
  Transactions: ${transactionsCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
