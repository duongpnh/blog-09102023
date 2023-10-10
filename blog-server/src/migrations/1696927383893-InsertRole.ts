import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRole1696927383893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO roles(id, name) VALUES (1, 'Super Admin');
      `);

    await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('roles', 'id'), MAX(id)) FROM "roles"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM roles;
      `);
  }
}
