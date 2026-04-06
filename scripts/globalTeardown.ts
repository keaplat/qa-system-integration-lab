import { execSync } from 'node:child_process';

export default async function globalTeardown(): Promise<void> {
  execSync('docker compose down -v', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}
