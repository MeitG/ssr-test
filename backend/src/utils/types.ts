// Contact data type
import { Request } from 'express';

export interface RenderOptions {
  title?: string;
  styles?: string[];
  scripts?: string[];
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
  }
  
  export interface User {
    id: string;
    fullname: string;
    email: string;
    password: string;
  }
  export type UserInfo = Omit<User,'password'>;
  
  export interface Session {
    id: string;
    userId: string;
    createdAt: string;
  }

  export interface AuthRequest extends Request {
    auth?: Auth;
  }

  export interface Auth {
    isAuthenticated: boolean;
    user?: UserInfo;
    sessionID?: string;
  }