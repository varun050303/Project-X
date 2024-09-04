import { v4 as uuidv4 } from 'uuid';

export function generateState() {
    return uuidv4(); // Generates a unique UUID string
}