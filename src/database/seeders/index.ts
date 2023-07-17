import { UsersSeeder } from './users.seeder';

(async () => {
  try {
    const seed1 = new UsersSeeder();
    await Promise.all([seed1.run()]);
  } catch (err) {
    console.log('Seeder error', err);
  }
})();
