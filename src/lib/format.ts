export function formatCurrency(value: number | string, currency = 'NGN') {
  const num = typeof value === 'string' ? parseFloat(value as string) : Number(value);
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(num);
}

export default formatCurrency;
