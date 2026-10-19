const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'sielabs-next');

const files = {
  'src/lib/mongodb.ts': `import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;`,

  'src/models/User.ts': `import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = models.User || mongoose.model('User', userSchema);
export default User;`,

  'src/app/api/auth/signup/route.ts': `import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectToDatabase();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    // Saving the password directly as plain text (Not recommended for production)
    const newUser = await User.create({ name, email, password });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}`,

  'src/app/api/auth/login/route.ts': `import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    // Compare plain text passwords
    if (password !== user.password) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(targetDir, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log('Files created successfully!');
