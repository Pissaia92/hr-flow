import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { HashUtils } from '../utils/hash.utils';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthController {
// New user registration
static async register(req: Request, res: Response): Promise<Response> {
try {
const { name, email, password, role } = req.body;

// Basic validation
if (!name || !email || !password) {
return res.status(400).json({
error: 'Name, email, and password are required'
});
}

// Check if user already exists
const existingUser = await UserModel.findByEmail(email);
if (existingUser) {
return res.status(409).json({
error: 'User with this email already exists'
});
}

// Password hash
const password_hash = HashUtils.hashPassword(password);

// Create user
const user = await UserModel.create({
name,
email,
password_hash,
role: role || 'employee'
});

if (!user) {
return res.status(500).json({
error: 'Error creating user'
});
}

// Generate JWT token
const token = JwtUtils.generateToken({
userId: user.id!,
role: user.role
});

// Remove password_hash from the response
const { password_hash: _, ...userResponse } = user as any;

return res.status(201).json({
message: 'User created successfully',
user: userResponse,
token
});

} catch (error) {
console.error('Error registering:', error);
return res.status(500).json({
error: 'Internal server error'
});
}}

// User login
static async login(req: Request, res: Response): Promise<Response> {
try {
const { email, password } = req.body;

// Basic Validation
if (!email || !password) {
return res.status(400).json({
error: 'Email and password are required'
});
}

// Search user by email
const user = await UserModel.findByEmail(email);
if (!user) {
return res.status(401).json({
error: 'Invalid credentials'
});
}

// Verify password
const isPasswordValid = HashUtils.verifyPassword(password, user.password_hash);
if (!isPasswordValid) {
return res.status(401).json({
error: 'Invalid credentials'
}); }

// Generate JWT token
const token = JwtUtils.generateToken({
userId: user.id!,
role: user.role
});

// Remove password_hash from the response
const { password_hash: _, ...userResponse } = user as any;

return res.status(200).json({
message: 'Login successful',
user: userResponse,
token
});

} catch (error) {
console.error('Login error:', error);
return res.status(500).json({
error: 'Internal server error'
});
}}

// User profile (requires authentication)
static async profile(req: Request, res: Response): Promise<Response> {
try {
// req.user will be added by the authentication middleware
const user = req.user;

if (!user) {
return res.status(401).json({
error: 'Unauthorized'
});
}

// Remove password_hash from the response
const { password_hash: _, ...userResponse } = user as any;

return res.status(200).json({
user: userResponse
});

} catch (error) {
console.error('Error fetching profile:', error);
return res.status(500).json({
error: 'Internal server error'
});
}}}