import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Checks if a user is an authorized admin via database role
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

  // Database check: Verify user has role 'admin'
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
