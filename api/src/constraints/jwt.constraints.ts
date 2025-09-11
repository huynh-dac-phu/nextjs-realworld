import * as crypto from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'fs';

function checkIsExistFolder(folderName: string) {
  const checkPath = path.join(__dirname, `../../${folderName}`);
  if (!fs.existsSync(checkPath)) {
    fs.mkdir(checkPath, err => err);
  }
}

function getAcessTokenKeyPair() {
  checkIsExistFolder('secure');
  const accessTokenPrivateKeyPath = path.join(
    __dirname,
    '../../secure/access-token-private-key.key',
  );
  const accessTokenPublicKeyPath = path.join(
    __dirname,
    '../../secure/access-token-public.key',
  );

  const accessTokenPrivateKeyExist = fs.existsSync(accessTokenPrivateKeyPath);
  const accessTokenPublicKeyExist = fs.existsSync(accessTokenPublicKeyPath);

  if (!accessTokenPrivateKeyExist || !accessTokenPublicKeyExist) {
    // If not exist, generate new key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Write to file
    fs.writeFileSync(accessTokenPrivateKeyPath, privateKey);
    fs.writeFileSync(accessTokenPublicKeyPath, publicKey);
  }
  const accessTokenPrivateKey = fs.readFileSync(
    accessTokenPrivateKeyPath,
    'utf8',
  );
  const accessTokenPublicKey = fs.readFileSync(
    accessTokenPublicKeyPath,
    'utf8',
  );

  return {
    accessTokenPrivateKey,
    accessTokenPublicKey,
  };
}

function getRefreshTokenKeyPair() {
  checkIsExistFolder('secure');
  const refreshTokenPrivateKeyPath = path.join(
    __dirname,
    '../../secure/refresh-token-private-key.key',
  );
  const refreshTokenPublicKeyPath = path.join(
    __dirname,
    '../../secure/refresh-token-public-key.key',
  );

  const refreshTokenPrivateKeyExist = fs.existsSync(refreshTokenPrivateKeyPath);
  const refreshTokenPublicKeyExist = fs.existsSync(refreshTokenPublicKeyPath);
  if (!refreshTokenPrivateKeyExist || !refreshTokenPublicKeyExist) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    fs.writeFileSync(refreshTokenPrivateKeyPath, privateKey);
    fs.writeFileSync(refreshTokenPublicKeyPath, publicKey);
  }

  const refreshTokenPrivateKey = fs.readFileSync(
    refreshTokenPrivateKeyPath,
    'utf8',
  );
  const refreshTokenPublicKey = fs.readFileSync(
    refreshTokenPublicKeyPath,
    'utf8',
  );

  return {
    refreshTokenPrivateKey,
    refreshTokenPublicKey,
  };
}

export const { accessTokenPrivateKey, accessTokenPublicKey } =
  getAcessTokenKeyPair();

export const { refreshTokenPrivateKey, refreshTokenPublicKey } =
  getRefreshTokenKeyPair();
