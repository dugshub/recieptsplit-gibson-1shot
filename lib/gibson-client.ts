import axios from 'axios';

// Get these values from environment variables
export const API_URL = process.env.NEXT_PUBLIC_GIBSON_API_URL || '';
export const API_KEY = process.env.NEXT_PUBLIC_GIBSON_API_KEY || '';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Gibson-API-Key': API_KEY,
  },
});

// Generic function to execute SQL queries
export const executeQuery = async <T>(sql: string): Promise<T> => {
  try {
    const response = await apiClient.post('', { query: sql });
    return response.data as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Type definitions based on our database schema
export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  password_hash: string;
  date_created: string;
  date_updated: string | null;
}

export interface Trip {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  date_created: string;
  date_updated: string | null;
}

export interface TripMember {
  id: number;
  uuid: string;
  trip_id: number;
  user_id: number;
  role: 'owner' | 'member';
  date_created: string;
  date_updated: string | null;
  username?: string; // Joined from User table
}

export interface Receipt {
  id: number;
  uuid: string;
  trip_id: number;
  user_id: number;
  title: string;
  date: string;
  total_amount: number;
  merchant: string | null;
  image_path: string | null;
  processing_status: 'uploaded' | 'processing' | 'ready' | 'error';
  date_created: string;
  date_updated: string | null;
  username?: string; // Joined from User table
}

export interface LineItem {
  id: number;
  uuid: string;
  receipt_id: number;
  description: string;
  amount: number;
  quantity: number;
  date_created: string;
  date_updated: string | null;
}

export interface Split {
  id: number;
  uuid: string;
  line_item_id: number;
  user_id: number;
  amount: number;
  percentage: number | null;
  date_created: string;
  date_updated: string | null;
  username?: string; // Joined from User table
}

export interface Balance {
  user_id: number;
  username: string;
  amount: number;
}

// Authentication services
export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    // In a real app, you would never handle passwords this way - this is just for demonstration
    // GibsonAI should handle proper password hashing
    const sql = `SELECT * FROM user WHERE username = '${username}' AND password_hash = '${password}'`;
    const result = await executeQuery<User[]>(sql);
    if (result.length === 0) {
      throw new Error('Invalid username or password');
    }
    return result[0];
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    // Again, this is for demonstration only - real apps should use proper auth flows
    const sql = `INSERT INTO user (username, email, password_hash) VALUES ('${username}', '${email}', '${password}') RETURNING *`;
    const result = await executeQuery<User[]>(sql);
    return result[0];
  }
};

// Trip services
export const tripService = {
  getTrips: async (userId: number): Promise<Trip[]> => {
    const sql = `
      SELECT t.* 
      FROM trip t 
      JOIN trip_member tm ON t.id = tm.trip_id 
      WHERE tm.user_id = ${userId} 
      ORDER BY t.date_created DESC
    `;
    return executeQuery<Trip[]>(sql);
  },

  getTripById: async (tripId: number): Promise<Trip> => {
    const sql = `SELECT * FROM trip WHERE id = ${tripId}`;
    const result = await executeQuery<Trip[]>(sql);
    if (result.length === 0) {
      throw new Error('Trip not found');
    }
    return result[0];
  },

  createTrip: async (name: string, description: string | null, startDate: string, endDate: string | null, userId: number): Promise<Trip> => {
    // First create the trip
    const createTripSql = `
      INSERT INTO trip (name, description, start_date, end_date) 
      VALUES ('${name}', ${description ? `'${description}'` : 'NULL'}, '${startDate}', ${endDate ? `'${endDate}'` : 'NULL'})
      RETURNING *
    `;
    const trips = await executeQuery<Trip[]>(createTripSql);
    const trip = trips[0];
    
    // Then add the creator as an owner
    const addOwnerSql = `
      INSERT INTO trip_member (trip_id, user_id, role) 
      VALUES (${trip.id}, ${userId}, 'owner')
    `;
    await executeQuery(addOwnerSql);
    
    return trip;
  },

  getTripMembers: async (tripId: number): Promise<TripMember[]> => {
    const sql = `
      SELECT tm.*, u.username 
      FROM trip_member tm 
      JOIN user u ON tm.user_id = u.id 
      WHERE tm.trip_id = ${tripId}
    `;
    return executeQuery<TripMember[]>(sql);
  },

  addTripMember: async (tripId: number, userId: number, role: 'owner' | 'member'): Promise<TripMember> => {
    const sql = `
      INSERT INTO trip_member (trip_id, user_id, role) 
      VALUES (${tripId}, ${userId}, '${role}')
      RETURNING *
    `;
    const members = await executeQuery<TripMember[]>(sql);
    return members[0];
  }
};

// Receipt services
export const receiptService = {
  getReceipts: async (tripId: number): Promise<Receipt[]> => {
    const sql = `
      SELECT r.*, u.username 
      FROM receipt r 
      JOIN user u ON r.user_id = u.id 
      WHERE r.trip_id = ${tripId} 
      ORDER BY r.date DESC
    `;
    return executeQuery<Receipt[]>(sql);
  },

  getReceiptById: async (receiptId: number): Promise<Receipt> => {
    const sql = `
      SELECT r.*, u.username 
      FROM receipt r 
      JOIN user u ON r.user_id = u.id 
      WHERE r.id = ${receiptId}
    `;
    const result = await executeQuery<Receipt[]>(sql);
    if (result.length === 0) {
      throw new Error('Receipt not found');
    }
    return result[0];
  },

  createReceipt: async (tripId: number, userId: number, title: string, date: string, totalAmount: number, merchant: string | null): Promise<Receipt> => {
    const sql = `
      INSERT INTO receipt (trip_id, user_id, title, date, total_amount, merchant, processing_status) 
      VALUES (${tripId}, ${userId}, '${title}', '${date}', ${totalAmount}, ${merchant ? `'${merchant}'` : 'NULL'}, 'ready')
      RETURNING *
    `;
    const receipts = await executeQuery<Receipt[]>(sql);
    return receipts[0];
  }
};

// LineItem services
export const lineItemService = {
  getLineItems: async (receiptId: number): Promise<LineItem[]> => {
    const sql = `
      SELECT * FROM receipt_line_item 
      WHERE receipt_id = ${receiptId} 
      ORDER BY id
    `;
    return executeQuery<LineItem[]>(sql);
  },

  createLineItem: async (receiptId: number, description: string, amount: number, quantity: number = 1): Promise<LineItem> => {
    const sql = `
      INSERT INTO receipt_line_item (receipt_id, description, amount, quantity) 
      VALUES (${receiptId}, '${description}', ${amount}, ${quantity})
      RETURNING *
    `;
    const lineItems = await executeQuery<LineItem[]>(sql);
    return lineItems[0];
  }
};

// Split services
export const splitService = {
  getSplits: async (lineItemId: number): Promise<Split[]> => {
    const sql = `
      SELECT s.*, u.username 
      FROM receipt_split s 
      JOIN user u ON s.user_id = u.id 
      WHERE s.line_item_id = ${lineItemId}
    `;
    return executeQuery<Split[]>(sql);
  },

  createSplit: async (lineItemId: number, userId: number, amount: number, percentage: number | null = null): Promise<Split> => {
    const sql = `
      INSERT INTO receipt_split (line_item_id, user_id, amount, percentage) 
      VALUES (${lineItemId}, ${userId}, ${amount}, ${percentage || 'NULL'})
      RETURNING *
    `;
    const splits = await executeQuery<Split[]>(sql);
    return splits[0];
  },

  getTripBalances: async (tripId: number): Promise<Balance[]> => {
    const sql = `
      SELECT 
        u.id AS user_id,
        u.username,
        (
          COALESCE(SUM(CASE WHEN r.user_id = u.id THEN r.total_amount ELSE 0 END), 0) - 
          COALESCE(SUM(CASE WHEN s.user_id = u.id THEN s.amount ELSE 0 END), 0)
        ) AS amount
      FROM 
        user u
      JOIN 
        trip_member tm ON u.id = tm.user_id
      LEFT JOIN 
        receipt r ON tm.trip_id = r.trip_id
      LEFT JOIN 
        receipt_line_item li ON r.id = li.receipt_id
      LEFT JOIN 
        receipt_split s ON li.id = s.line_item_id
      WHERE 
        tm.trip_id = ${tripId}
      GROUP BY 
        u.id, u.username
    `;
    
    return executeQuery<Balance[]>(sql);
  }
};

// User services
export const userService = {
  searchUsers: async (searchTerm: string): Promise<User[]> => {
    const sql = `
      SELECT id, uuid, username, email, date_created, date_updated
      FROM user
      WHERE username LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%'
      LIMIT 10
    `;
    return executeQuery<User[]>(sql);
  }
};