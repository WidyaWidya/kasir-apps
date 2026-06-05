# NextAuth Integration Setup Guide

## Konfigurasi yang Telah Dilakukan

1. **NextAuth Configuration** (`src/lib/auth.ts`)
   - Setup credentials provider dengan username dan password
   - Integrasi dengan Prisma User model
   - Password hashing menggunakan bcrypt

2. **API Route** (`src/app/api/auth/[...nextauth]/route.ts`)
   - Endpoint untuk handling autentikasi

3. **Type Definitions** (`src/types/next-auth.d.ts`)
   - Extended session dengan user fields: id, username, fullName, role

4. **SignInForm Component** (`src/components/auth/SignInForm.tsx`)
   - Integrated dengan next-auth/react signIn function
   - Error handling dan loading states
   - Redirect ke dashboard setelah login berhasil

## Langkah Setup Lanjutan

### 1. Update `.env.local`
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Session Provider Middleware
Tambahkan SessionProvider di root layout jika belum ada:

```tsx
// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 3. Proteksi Routes
Untuk melindungi admin routes, buat middleware:

```tsx
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add custom logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
```

### 4. Test Login
1. Pastikan sudah ada user di database dengan password yang sudah di-hash
2. Akses http://localhost:3000/signin
3. Login dengan username dan password yang sudah dibuat

## Menggunakan Session di Component

### Client Component
```tsx
"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  
  if (!session) {
    return <p>Not signed in</p>;
  }
  
  return <p>Welcome {session.user.fullName}!</p>;
}
```

### Server Component
```tsx
import { auth } from "@/lib/auth-client";

export default async function Component() {
  const session = await auth();
  
  if (!session) {
    return <p>Not signed in</p>;
  }
  
  return <p>Welcome {session.user.fullName}!</p>;
}
```

## Signout
```tsx
import { signOut } from "next-auth/react";

<button onClick={() => signOut()}>Sign out</button>
```
