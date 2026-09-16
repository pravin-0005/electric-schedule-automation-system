import contract from "../contracts/foundation.json"

export type FileKind = "drawing" | "template"
export type FileCheck = { name: string; size: number; sha256: string }
export const fileLimits = contract.fileLimits

export function validateProjectName(name: string): string | null {
  return name.trim().length === 0 || name.trim().length > 160
    ? "Enter a project name between 1 and 160 characters, excluding surrounding spaces."
    : null
}

export function validateFile(file: Pick<File, "name" | "size">, kind: FileKind): string | null {
  const extension = kind === "drawing" ? ".pdf" : ".xlsx"
  if (!file.name.toLowerCase().endsWith(extension)) return `Choose a ${extension} file. Other formats are not supported yet.`
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > fileLimits[kind]) {
    return `Choose a non-empty file up to ${fileLimits[kind] / 1024 / 1024} MiB.`
  }
  return null
}

export async function checkFile(file: File, kind: FileKind): Promise<FileCheck> {
  const error = validateFile(file, kind)
  if (error) throw new Error(error)
  if (!globalThis.crypto?.subtle) throw new Error("Secure file checks are unavailable. Open the workspace over HTTPS or localhost.")
  let buffer: ArrayBuffer
  try {
    buffer = await file.arrayBuffer()
  } catch {
    throw new Error("The file could not be read. Remove it and select it again.")
  }
  const signature = new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength))
  const valid = kind === "drawing"
    ? new TextDecoder().decode(signature) === "%PDF-"
    : signature[0] === 0x50 && signature[1] === 0x4b && signature[2] === 0x03 && signature[3] === 0x04
  if (!valid) throw new Error(`${file.name} does not have the expected ${kind === "drawing" ? "PDF" : "ZIP-based XLSX"} signature.`)
  const hash = await crypto.subtle.digest("SHA-256", buffer)
  return { name: file.name, size: file.size, sha256: Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("") }
}
