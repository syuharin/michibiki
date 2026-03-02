export async function fetchRulebook(): Promise<string> {
  const response = await fetch("/rules.md");
  if (!response.ok) {
    throw new Error(`Rulebook not found (Status: ${response.status})`);
  }
  return response.text();
}
