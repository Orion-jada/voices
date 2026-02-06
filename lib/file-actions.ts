'use server';
import mammoth from 'mammoth';

export async function parseDocx(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return '';
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await mammoth.convertToHtml({ buffer });
  return result.value;
}
