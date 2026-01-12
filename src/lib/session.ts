import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

const secretKey = process.env.AUTH_SECRET || 'super-secret-key-change-me';
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload }) // Spread to ensure plain object
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  return { isAuth: true, userId: payload.userId, role: payload.role };
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  // Refresh expiration if needed (e.g. rolling session)
  // For now, simple return
  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
