/**
 * The single place the app chooses its storage backend.
 * To move to Supabase, create supabaseRepo.js with the same methods
 * and change the export below.
 */
import { localStorageRepo } from './localStorageRepo.js';

export const repo = localStorageRepo;
