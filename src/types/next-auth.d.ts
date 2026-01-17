import "next-auth";
import "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}