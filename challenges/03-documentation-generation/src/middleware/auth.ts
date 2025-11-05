import { Request, Response, NextFunction } from 'express';
import { verify, sign, JwtPayload } from 'jsonwebtoken';
import { DatabaseService } from '../utils/database';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export class AuthMiddleware {
    private db: DatabaseService;
    private jwtSecret: string;

    constructor() {
        this.db = new DatabaseService();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }

    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token = this.extractToken(req);
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication token required'
                });
            }

            const decoded = verify(token, this.jwtSecret) as JwtPayload;
            
            if (!decoded || typeof decoded === 'string') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token format'
                });
            }

            const user = await this.db.findUserById(decoded.userId);
            
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found or inactive'
                });
            }

            if (decoded.tokenVersion !== user.tokenVersion) {
                return res.status(401).json({
                    success: false,
                    message: 'Token has been revoked'
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }
    };

    requireRole = (requiredRole: string) => {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (req.user.role !== requiredRole && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            next();
        };
    };

    requireRoles = (allowedRoles: string[]) => {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions'
                });
            }

            next();
        };
    };

    generateToken = async (userId: string): Promise<string> => {
        const user = await this.db.findUserById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion
        };

        return sign(payload, this.jwtSecret, {
            expiresIn: '24h',
            issuer: 'inventory-api',
            audience: 'inventory-users'
        });
    };

    generateRefreshToken = async (userId: string): Promise<string> => {
        const user = await this.db.findUserById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        const payload = {
            userId: user.id,
            type: 'refresh',
            tokenVersion: user.tokenVersion
        };

        return sign(payload, this.jwtSecret, {
            expiresIn: '7d',
            issuer: 'inventory-api',
            audience: 'inventory-users'
        });
    };

    refreshAccessToken = async (refreshToken: string): Promise<string> => {
        try {
            const decoded = verify(refreshToken, this.jwtSecret) as JwtPayload;
            
            if (!decoded || decoded.type !== 'refresh') {
                throw new Error('Invalid refresh token');
            }

            const user = await this.db.findUserById(decoded.userId);
            
            if (!user || !user.isActive) {
                throw new Error('User not found or inactive');
            }

            if (decoded.tokenVersion !== user.tokenVersion) {
                throw new Error('Token has been revoked');
            }

            return await this.generateToken(user.id);
        } catch (error) {
            throw new Error('Failed to refresh token');
        }
    };

    revokeUserTokens = async (userId: string): Promise<void> => {
        await this.db.incrementUserTokenVersion(userId);
    };

    private extractToken(req: Request): string | null {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7);
        }

        const cookieToken = req.cookies?.accessToken;
        if (cookieToken) {
            return cookieToken;
        }

        return null;
    }
}

export const authMiddleware = new AuthMiddleware();