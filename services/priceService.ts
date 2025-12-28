
export interface LivePriceData {
  price: number;
  change24h: number;
  symbol: string;
}

/**
 * Fetches live price data for a list of tokens using DexScreener's public API.
 * This API is free, requires no key, and supports most chains.
 */
export const fetchLivePrices = async (tokens: { symbol: string; name: string }[]): Promise<Record<string, LivePriceData>> => {
  const results: Record<string, LivePriceData> = {};
  
  try {
    // We process tokens in parallel
    const promises = tokens.map(async (token) => {
      try {
        // DexScreener search endpoint is very robust for finding the best pair
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${token.symbol}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
          // Find the pair with the most liquidity for accuracy
          const bestPair = data.pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
          
          results[token.symbol.toUpperCase()] = {
            price: parseFloat(bestPair.priceUsd),
            change24h: parseFloat(bestPair.priceChange?.h24 || "0"),
            symbol: token.symbol.toUpperCase()
          };
        }
      } catch (e) {
        console.warn(`Failed to fetch live price for ${token.symbol}`, e);
      }
    });

    await Promise.all(promises);
  } catch (err) {
    console.error("Price Oracle Error:", err);
  }

  return results;
};
