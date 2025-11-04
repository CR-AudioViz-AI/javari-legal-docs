import pdf from 'pdf-parse'
import mammoth from 'mammoth'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('DOCX extraction error:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

export async function extractTextFromTXT(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8')
}

export async function processUploadedFile(
  file: File
): Promise<{ text: string; filename: string; fileType: string }> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name
  const fileType = file.type

  let text: string

  if (fileType === 'application/pdf' || filename.endsWith('.pdf')) {
    text = await extractTextFromPDF(buffer)
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filename.endsWith('.docx')
  ) {
    text = await extractTextFromDOCX(buffer)
  } else if (fileType === 'text/plain' || filename.endsWith('.txt')) {
    text = await extractTextFromTXT(buffer)
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.')
  }

  return { text, filename, fileType }
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export function getSupportedFileTypes(): string[] {
  return ['.pdf', '.docx', '.txt']
}

export function isSupportedFileType(filename: string): boolean {
  const supportedTypes = getSupportedFileTypes()
  return supportedTypes.some(type => filename.toLowerCase().endsWith(type))
}
