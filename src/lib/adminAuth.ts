import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Checks if the given username/email matches the private admin configuration in environment variables
 */
export function isEnvAdmin(userIdentifier?: string | null): boolean {
  if (!userIdentifier) return false;
  const trimmed = userIdentifier.trim().toLowerCase();
  const envAdmin = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  return Boolean(envAdmin && trimmed === envAdmin);
}

/**
 * Checks if a user is an authorized admin via environment variable or database role
 */
export async function isAuthorizedAdmin(
  reqOrUser?: Request | string | null,
  fallbackUser?: string | null
): Promise<boolean> {
  let identifier: string | null = null;

  if (typeof reqOrUser === 'string') {
    identifier = reqOrUser;
  } else if (reqOrUser && typeof reqOrUser === 'object' && 'headers' in reqOrUser) {
    identifier = reqOrUser.headers.get('x-admin-user');
    if (!identifier) {
      try {
        const url = new URL(reqOrUser.url);
        identifier = url.searchParams.get('admin');
      } catch {
        // Ignore invalid URL
      }
    }
  }

  if (!identifier && fallbackUser) {
    identifier = fallbackUser;
  }

  if (!identifier) return false;

  // 1. Fast path: Check private server environment variable
  if (isEnvAdmin(identifier)) {
    return true;
  }

  // 2. Database path: Check if user has role 'admin'
  try {
    await connectToDatabase();
    const user = await User.findOne({
      $or: [{ email: identifier.trim() }, { name: identifier.trim() }]
    }).select('role');
    if (user && user.role === 'admin') {
      return true;
    }
  } catch (error) {
    console.error('Error in isAuthorizedAdmin DB check:', error);
  }

  return false;
}
