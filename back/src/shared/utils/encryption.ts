import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function getEncryptionKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  if (encryptionKey.length < 32) {
    throw new Error('ENCRYPTION_KEY must be at least 32 characters long');
  }

  const keyBuffer = Buffer.from(encryptionKey, 'utf8');
  
  if (keyBuffer.length >= KEY_LENGTH) {
    return keyBuffer.subarray(0, KEY_LENGTH);
  }

  return crypto.scryptSync(encryptionKey, 'delicious-plus-salt-v1', KEY_LENGTH);
}

function deriveKeyFromMaster(masterKey: Buffer, salt: Buffer): Buffer {
  return crypto.scryptSync(masterKey, salt, KEY_LENGTH, {
    N: 16384,
    r: 8,
    p: 1,
  });
}

export class EncryptionService {
  private static masterKey: Buffer;

  private static getMasterKey(): Buffer {
    if (!this.masterKey) {
      this.masterKey = getEncryptionKey();
    }
    return this.masterKey;
  }

  static encrypt(text: string): string {
    if (!text || text.trim().length === 0) {
      return text;
    }

    try {
      const masterKey = this.getMasterKey();
      const salt = crypto.randomBytes(SALT_LENGTH);
      const derivedKey = deriveKeyFromMaster(masterKey, salt);
      const iv = crypto.randomBytes(IV_LENGTH);

      const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      const result = Buffer.concat([
        salt,
        iv,
        tag,
        Buffer.from(encrypted, 'hex')
      ]).toString('base64');

      return result;
    } catch (error) {
      throw new Error(`Erro ao criptografar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  static decrypt(encryptedData: string): string {
    if (!encryptedData || encryptedData.trim().length === 0) {
      return encryptedData;
    }

    try {
      const masterKey = this.getMasterKey();
      const data = Buffer.from(encryptedData, 'base64');

      const salt = data.subarray(0, SALT_LENGTH);
      const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const tag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
      const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

      const derivedKey = deriveKeyFromMaster(masterKey, salt);

      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Erro ao descriptografar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  static encryptOptional(text: string | null | undefined): string | null {
    if (!text) {
      return null;
    }
    return this.encrypt(text);
  }

  static decryptOptional(encryptedData: string | null | undefined): string | null {
    if (!encryptedData) {
      return null;
    }
    return this.decrypt(encryptedData);
  }
}

