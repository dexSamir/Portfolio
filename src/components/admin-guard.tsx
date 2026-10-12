import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getSessionToken } from '@/services/session';
export const AdminGuard = ({ children }: { children: ReactNode }) => getSessionToken() ? <>{children}</> : <Navigate to="/login" replace />;
