import { readFileSync } from 'node:fs';

const sourceVerificationRules = JSON.parse(readFileSync(new URL('../../pipeline/contracts/source-verification.json', import.meta.url), 'utf8'));

export const SOURCE_VERIFICATION_RULES = sourceVerificationRules;

export function sourceVerificationPlan(country) {
  const rules = sourceVerificationRules[country];
  return rules ? structuredClone(rules) : null;
}
