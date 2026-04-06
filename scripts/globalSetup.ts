import { execSync } from 'node:child_process';

async function waitForHealthCheck(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1_500));
  }

  throw new Error(`Service did not become ready at ${url}`);
}

export default async function globalSetup(): Promise<void> {
  execSync('docker compose up -d --build', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  await waitForHealthCheck('http://127.0.0.1:3000/api/health', 120_000);
}
