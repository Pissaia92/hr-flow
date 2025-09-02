import { Request, Response } from 'express';
import { DemandModel } from '../models/demand.model';
import { PriorityUtils } from '../utils/priority.utils';
import { EmailService } from '../services/email.service';
import { UserModel } from '../models/user.model';

// Instantiate the email service
const emailService = new EmailService();

export class DemandsController { 
// Create new demand 
static async create(req: Request, res: Response): Promise<Response> { 
try { 
const { type, description, priority, status } = req.body; 
const userId = req.user?.id; 

// Basic Validation
if (!type || !description) {
return res.status(400).json({
error: 'Type and description are required'
});
}

// Calculate priority automatically if not provided
const calculatedPriority = priority || PriorityUtils.calculatePriority(description);

// Create demand
const demand = await DemandModel.create({
type,
description,
priority: calculatedPriority,
status: status || 'open',
user_id: userId
});

if (!demand) {
return res.status(500).json({
error: 'Error creating demand'
}); }

// If the demand is urgent, send an email notification
if (calculatedPriority === 'urgent') {
try {
// Get user information
const user = await UserModel.findById(userId);
if (user) {
await emailService.sendUrgentDemandNotification(demand, user.email, user.name);
}
} catch (emailError) {
console.error('Error sending urgent demand notification:', emailError);
// Don't fail the request because of the email
}
}

return res.status(201).json({
message: 'Demand created successfully',
demand
});
} catch (error) {
console.error('Error creating demand:', error); return res.status(500).json({
error: 'Internal server error'
});
}
}

// List all demands (HR only)
static async getAll(req: Request, res: Response): Promise<Response> {
try {
const demands = await DemandModel.findAll();
return res.status(200).json({
demands
});
} catch (error) {
console.error('Error finding demands:', error);
return res.status(500).json({
error: 'Internal server error'
});
}
}

// List demands of the logged-in user
static async getByUser(req: Request, res: Response): Promise<Response> {
try {
const userId = req.user?.id;
const demands = await DemandModel.findByUserId(userId);
return res.status(200).json({
demands
});
} catch (error) {
console.error('Error retrieving user demands:', error);
return res.status(500).json({
error: 'Internal server error'
});
}
}

// Search demand by ID
static async getById(req: Request, res: Response): Promise<Response> {
try {
const { id } = req.params;
const demand = await DemandModel.findById(id);
if (!demand) {
return res.status(404).json({
error: 'Demand not found'
});
}
return res.status(200).json({
demand
});
} catch (error) {
console.error('Error fetching demand:', error);
return res.status(500).json({
error: 'Internal server error'
});
}
}

// Update demand
static async update(req: Request, res: Response): Promise<Response> {
try {
const { id } = req.params;
const updates = req.body;

// Remove fields that shouldn't be updated
delete updates.id;
delete updates.user_id;
delete updates.created_at;

// Recalculate priority if description was updated
if (updates.description && !updates.priority) {
updates.priority = PriorityUtils.calculatePriority(updates.description);
}

const demand = await DemandModel.update(id, updates);
if (!demand) {
return res.status(404).json({
error: 'Demand not found'
});
}
return res.status(200).json({
message: 'Demand updated successfully',
demand
});
} catch (error) {
console.error('Error updating demand:', error);
return res.status(500).json({
error: 'Internal server error'
}); }
}

// Delete demand
static async delete(req: Request, res: Response): Promise<Response> {
try {
const { id } = req.params;
const demand = await DemandModel.update(id, { status: 'closed' });
if (!demand) {
return res.status(404).json({
error: 'Demand not found'
});
}
return res.status(200).json({
message: 'Demand closed successfully'
});
} catch (error) {
console.error('Error deleting demand:', error);return res.status(500).json({
error: 'Internal server error'
});
}
}

// List open demands (HR only)
static async getOpenDemands(req: Request, res: Response): Promise<Response> {
try {
const demands = await DemandModel.findOpen();
return res.status(200).json({
demands
});
} catch (error) {
console.error('Error finding open demands:', error);
return res.status(500).json({
error: 'Internal server error'
});
}
}

// List closed demands (HR only)
static async getClosedDemands(req: Request, res: Response): Promise<Response> {
try {
const demands = await DemandModel.findClosed();
return res.status(200).json({
demands
});
} catch (error) {
console.error('Error finding closed demands:', error);
return res.status(500).json({
error: 'Internal server error'
});
}
}
}