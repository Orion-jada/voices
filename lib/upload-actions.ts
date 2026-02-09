'use server';

import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function uploadImage(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!allowedExtensions.includes(ext)) {
        throw new Error('Invalid file type. Only images are allowed.');
    }

    // Generate unique filename
    const filename = `${uuidv4()}.${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Write file
    await writeFile(uploadPath, buffer);

    // Return the public URL
    return `/uploads/${filename}`;
}
