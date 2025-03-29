import { MemStorage } from '../storage';

describe('MemStorage', () => {
  let storage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  test('createUser should add a user to storage', async () => {
    const user = await storage.createUser({
      username: 'testuser',
      email: 'test@vitstudent.ac.in',
      password: 'password123',
      fullName: 'Test User',
      program: 'BCA',
      year: '3'
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@vitstudent.ac.in');
    
    // Verify user was added to storage
    const retrievedUser = await storage.getUser(user.id);
    expect(retrievedUser).toEqual(user);
  });

  test('getUserByUsername should retrieve user by username', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@vitstudent.ac.in',
      password: 'password123',
      fullName: 'Test User',
      program: 'BCA',
      year: '3'
    };
    
    const user = await storage.createUser(userData);
    const retrievedUser = await storage.getUserByUsername('testuser');
    
    expect(retrievedUser).toEqual(user);
  });

  test('getUserByEmail should retrieve user by email', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@vitstudent.ac.in',
      password: 'password123',
      fullName: 'Test User',
      program: 'BCA',
      year: '3'
    };
    
    const user = await storage.createUser(userData);
    const retrievedUser = await storage.getUserByEmail('test@vitstudent.ac.in');
    
    expect(retrievedUser).toEqual(user);
  });

  // Add more tests for other storage methods
});