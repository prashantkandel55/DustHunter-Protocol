
import { GoogleGenAI, Type } from "@google/genai";
import { WalletAnalysis, ThreatLevel, GroundingSource } from "../types";

export const analyzeWallet = async (address: string, chain: string): Promise<WalletAnalysis> => {
  // Fix: Create instance inside the function to ensure the most up-to-date API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enhanced prompt focused on balance retrieval via search grounding
  const prompt = `System: You are Dusthunter Protocol, an elite cryptographic surveillance engine.
  Target: ${chain} address ${address}.
  
  TACTICAL REQUIREMENT: 
  You MUST use the Google Search tool to find the LATEST balance and transaction data. 
  Query public explorers (Etherscan, Solscan, etc.) to get:
  1. Current Native Balance (ETH/SOL/BTC).
  2. Top Token Holdings (ERC20/SPL).
  3. Total USD Valuation.
  4. Recent dusting attacks or "Zero-Transfer" poisoning attempts.
  5. Any associated phishing links in recent transaction history.

  If the wallet is a "cold wallet" with no history, report 0 balance but note the safety status.
  
  MANDATORY JSON FORMAT:
  Return the analysis in valid JSON according to the schema. Ensure totalUsdValue is a number.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            address: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER },
            threatLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            activeWatchers: { type: Type.NUMBER },
            lastAttackAttempt: { type: Type.STRING },
            suspiciousApprovals: { type: Type.NUMBER },
            totalUsdValue: { type: Type.NUMBER },
            holdings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  balance: { type: Type.STRING },
                  usdValue: { type: Type.NUMBER },
                  change24h: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER }
                },
                required: ["name", "symbol", "balance", "usdValue", "category", "riskScore"]
              }
            },
            approvals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tokenName: { type: Type.STRING },
                  tokenSymbol: { type: Type.STRING },
                  allowance: { type: Type.STRING },
                  lastUpdated: { type: Type.STRING },
                  contractAddress: { type: Type.STRING },
                  riskReason: { type: Type.STRING },
                  isVerified: { type: Type.BOOLEAN },
                  riskLevel: { type: Type.STRING }
                },
                required: ["tokenName", "tokenSymbol", "allowance", "lastUpdated", "riskReason", "isVerified", "riskLevel"]
              }
            },
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  type: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  txHash: { type: Type.STRING },
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  amount: { type: Type.STRING },
                  token: { type: Type.STRING },
                  attackSignature: { type: Type.STRING }
                },
                required: ["id", "timestamp", "type", "severity", "description"]
              }
            }
          },
          required: ["address", "safetyScore", "threatLevel", "summary", "activeWatchers", "events", "approvals", "holdings", "totalUsdValue"]
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    const sources: GroundingSource[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title
          });
        }
      });
    }

    return { ...result, sources } as WalletAnalysis;
  } catch (error) {
    console.error("Dusthunter Engine Error:", error);
    throw error;
  }
};
