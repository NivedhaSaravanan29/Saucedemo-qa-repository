import 'dotenv/config';

const env = (key: string, fallback: string) => process.env[key] ?? fallback;

export const config = {
  baseUrl: env('BASE_URL', 'https://www.saucedemo.com'),
  password: env('SHARED_PASSWORD', 'secret_sauce'),
  users: {
    standard: env('STANDARD_USER', 'standard_user'),
    locked: env('LOCKED_USER', 'locked_out_user'),
    problem: env('PROBLEM_USER', 'problem_user'),
  },
};

export const money = (text: string): number => {
  const m = text.match(/\$([\d,]+\.\d{2})/);
  if (!m) throw new Error(`No price found in "${text}"`);
  return Number(m[1].replace(',', ''));
};
