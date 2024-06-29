class AESLocalStorage {
  constructor(encryptionKey) {
    if (!encryptionKey) {
      throw new Error("Encryption key must be provided in initialization.");
    }
    this.encryptionKey = encryptionKey;
  }

  static init(encryptionKey) {
    return new AESLocalStorage(encryptionKey);
  }

  isCryptoSubtleAvailable() {
    return window.crypto && window.crypto.subtle;
  }

  fallbackEncode(text) {
    return window.btoa(text);
  }

  fallbackDecode(encodedText) {
    return window.atob(encodedText);
  }

  async makeKey(key) {
    return await crypto.subtle.importKey(
      "raw",
      Buffer.from(key, "base64"),
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encryptSymmetric(plaintext) {
    if (this.isCryptoSubtleAvailable()) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedPlaintext = new TextEncoder().encode(plaintext);
      const secretKey = await this.makeKey(this.encryptionKey);

      const ciphertext = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        secretKey,
        encodedPlaintext
      );

      return {
        ciphertext: Buffer.from(ciphertext).toString("base64"),
        iv: Buffer.from(iv).toString("base64"),
      };
    } else {
      const encodedText = this.fallbackEncode(plaintext);
      return {
        ciphertext: encodedText,
        iv: "",
      };
    }
  }

  async decryptSymmetric(ciphertext, iv) {
    if (this.isCryptoSubtleAvailable()) {
      const secretKey = await this.makeKey(this.encryptionKey);

      const cleartext = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: Buffer.from(iv, "base64"),
        },
        secretKey,
        Buffer.from(ciphertext, "base64")
      );
      const data = new TextDecoder().decode(cleartext);
      return data;
    } else {
      return this.fallbackDecode(ciphertext);
    }
  }

  async saveToLocalStorage(name, data) {
    const stringifiedData = JSON.stringify(data);
    const encryptedData = await this.encryptSymmetric(stringifiedData);
    localStorage.setItem(name, JSON.stringify(encryptedData));
  }

  async getFromLocalStorage(name) {
    const rawData = localStorage.getItem(name);
    if (!rawData) return null;

    const encryptedData = JSON.parse(rawData);
    const decryptedData = await this.decryptSymmetric(
      encryptedData.ciphertext,
      encryptedData.iv
    );
    return JSON.parse(decryptedData);
  }

  removeFromLocalStorage(name) {
    localStorage.removeItem(name);
  }
}

export default AESLocalStorage;
