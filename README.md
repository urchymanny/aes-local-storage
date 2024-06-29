# AES Local Storage

AES Local Storage is a lightweight JavaScript library for encrypting data stored in `localStorage` using the AES-GCM algorithm. It provides a secure way to save, retrieve, and remove data from `localStorage`.

## Installation

```bash
npm install aes-local-storage
```

## Usage

### Initialization

First, initialize the `AESLocalStorage` class with your encryption key.

```javascript
import AESLocalStorage from "aes-local-storage";

const localStorage = AESLocalStorage.init("your-encryption-key");
```

### Methods

#### `saveToLocalStorage(name, data)`

Saves data to `localStorage` with encryption.

- **Parameters**:
  - `name` (string): The key under which data is stored.
  - `data` (any): The data to be saved. It will be serialized to JSON.

**Example**:

```javascript
await localStorage.saveToLocalStorage("user", { username: "john_doe" });
```

#### `getFromLocalStorage(name)`

Retrieves and decrypts data from `localStorage`.

- **Parameters**:

  - `name` (string): The key under which data is stored.

- **Returns**: The decrypted data.

**Example**:

```javascript
const userData = await localStorage.getFromLocalStorage("user");
console.log(userData); // { username: 'john_doe' }
```

#### `removeFromLocalStorage(name)`

Removes data from `localStorage`.

- **Parameters**:
  - `name` (string): The key of the data to be removed.

**Example**:

```javascript
localStorage.removeFromLocalStorage("user");
```

### Example Usage

```javascript
import AESLocalStorage from "aes-local-storage";

const localStorage = AESLocalStorage.init("your-encryption-key");

(async () => {
  // Save data
  await localStorage.saveToLocalStorage("settings", { theme: "dark" });

  // Retrieve data
  const settings = await localStorage.getFromLocalStorage("settings");
  console.log(settings); // { theme: 'dark' }

  // Remove data
  localStorage.removeFromLocalStorage("settings");
})();
```

## Notes

- Make sure to use a secure encryption key.
- The encryption key must be in Base64 format.
- Ensure that the environment supports the Web Crypto API for optimal security.

## License

MIT
