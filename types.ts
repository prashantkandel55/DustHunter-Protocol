
export enum ThreatLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'DUSTING' | 'APPROVAL' | 'PHISHING' | 'WATCHER' | 'UNKNOWN' | 'TRANSFER' | 'SWAP' | 'EXPLOIT_LINK' | 'POISONING';
  severity: ThreatLevel;
  description: string;
  txHash?: string;
  from?: string;
  to?: string;
  amount?: string;
  token?: string;
  attackSignature?: string; // e.g. "Inferno Drainer Pattern", "Zero-Transfer Poison"
}

export interface TokenApproval {
  tokenName: string;
  tokenSymbol: string;
  allowance: string;
  lastUpdated: string;
  contractAddress: string;
  riskReason: string;
  isVerified: boolean;
  riskLevel: ThreatLevel;
}

export interface TokenHolding {
  name: string;
  symbol: string;
  balance: string;
  usdValue: number;
  change24h: number;
  category: 'NATIVE' | 'STABLE' | 'ALT' | 'NFT' | 'LP';
  riskScore: number; // 0-100, 100 being safest
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AttackVector {
  name: string;
  description: string;
  likelihood: number; // 0-100
  originGeo?: string;
}

export interface WalletAnalysis {
  address: string;
  safetyScore: number; // 0-100
  threatLevel: ThreatLevel;
  summary: string;
  activeWatchers: number;
  lastAttackAttempt: string | null;
  suspiciousApprovals: number;
  totalUsdValue: number;
  approvals: TokenApproval[];
  events: SecurityEvent[];
  holdings: TokenHolding[];
  attackVectors?: AttackVector[];
  sources?: GroundingSource[];
}

export interface MonitoredWallet {
  address: string;
  chain: Blockchain;
  lastAnalysis: WalletAnalysis;
  isActive: boolean;
  addedAt: number;
}

export interface AlertNotification {
  id: string;
  address: string;
  timestamp: number;
  title: string;
  message: string;
  severity: ThreatLevel;
  read: boolean;
}

export type Blockchain = 'Ethereum' | 'Solana' | 'Bitcoin' | 'Polygon';
