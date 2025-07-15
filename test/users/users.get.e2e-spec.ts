import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { appCreate } from 'src/app.create';
import * as request from 'supertest';
import { Server } from 'http';

// ***Make sure to disable the protectGuard befre testing***

describe('GET /users (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appCreate(app); // Apply real app behavior by running all middlewares
    await app.init(); // boot the app
    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated list of users', async () => {
    const res = await request(httpServer).get('/users').expect(200);

    const body = res.body as {
      abiVersion: string;
      data: {
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        data: unknown[];
      };
    };

    expect(Array.isArray(body.data.data)).toBe(true);
    expect(typeof body.data.totalItems).toBe('number');
    expect(typeof body.data.itemsPerPage).toBe('number');
  });

  it('should return a single user by valid UUID', async () => {
    const userId = '80b6309c-868a-4985-bf55-9bf19b7fa00d';

    const res = await request(httpServer).get(`/users/${userId}`).expect(200);

    const body = res.body as {
      abiVersion: string;
      data: {
        id: string;
        email: string;
        name: string;
        profileImage: string | null;
      };
    };

    expect(body.data.id).toBe(userId);
    expect(typeof body.data.email).toBe('string');
    expect(typeof body.data.name).toBe('string');
    expect(body.data.profileImage).toBeNull(); // or check other expected value
  });

  it('should return 400 for invalid UUID', async () => {
    await request(httpServer).get('/users/invalid-uuid').expect(400);
  });

  it('should return 404 for non-existent user ID', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000';
    await request(httpServer).get(`/users/${fakeId}`).expect(404);
  });
});
