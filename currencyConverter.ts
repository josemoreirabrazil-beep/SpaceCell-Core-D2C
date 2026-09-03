export class CurrencyConverter {
  // Taxas de câmbio estáticas para o ecossistema espacial
  private static rates = {
    USD: 5.62,
    EUR: 6.18,
    BRL: 1.00
  };

  // Converte faturamento de franquias internacionais para a base central em BRL
  static convertToBrl(amount: number, currency: 'USD' | 'EUR' | 'BRL'): { amountInBrl: number; formatted: string } {
    const rate = this.rates[currency] || 1.00;
    const converted = amount * rate;

    return {
      amountInBrl: converted,
      formatted: converted.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    };
  }
}
