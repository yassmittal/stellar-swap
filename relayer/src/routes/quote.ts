import express, { type Request, type Response } from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { config } from '../config'; // Assuming config file with chain IDs and escrow details

// Initialize LowDB
const adapter = new JSONFile('quotes.json');
const db = new Low(adapter, {});
await db.read();
db.data ||= { quotes: [] };

// Define interfaces for response
interface Point {
  delay: number;
  coefficient: number;
}

interface GasCost {
  gasBumpEstimate: number;
  gasPriceEstimate: string;
}

interface Preset {
  auctionDuration: number;
  startAuctionIn: number;
  initialRateBump: number;
  auctionStartAmount: string;
  startAmount: string;
  auctionEndAmount: string;
  exclusiveResolver: null;
  costInDstToken: string;
  points: Point[];
  allowPartialFills: boolean;
  allowMultipleFills: boolean;
  gasCost: GasCost;
  secretsCount: number;
}

interface TimeLocks {
  srcWithdrawal: number;
  srcPublicWithdrawal: number;
  srcCancellation: number;
  srcPublicCancellation: number;
  dstWithdrawal: number;
  dstPublicWithdrawal: number;
  dstCancellation: number;
}

interface Prices {
  usd: {
    srcToken: string;
    dstToken: string;
  };
}

interface Volume {
  usd: {
    srcToken: string;
    dstToken: string;
  };
}

interface QuoterResponse {
  quoteId: string;
  srcTokenAmount: string;
  dstTokenAmount: string;
  autoK: number;
  presets: {
    fast: Preset;
    medium: Preset;
    slow: Preset;
  };
  timeLocks: TimeLocks;
  srcEscrowFactory: string;
  dstEscrowFactory: string;
  srcSafetyDeposit: string;
  dstSafetyDeposit: string;
  whitelist: string[];
  recommendedPreset: string;
  prices: Prices;
  volume: Volume;
}

// Validation schema using Zod
const quoteSchema = z.object({
  srcChain: z.number().int().positive(),
  dstChain: z.number().int().positive(),
  srcTokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  dstTokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  amount: z.string().regex(/^\d+$/, 'Amount must be a valid number'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

// Mock exchange rate function (1:1 for simplicity)
const getExchangeRate = (srcToken: string, dstToken: string): number => {
  // In a real implementation, integrate with 1inch API or other price oracle
  return 1;
};

// Calculate token amounts and other dynamic values
const calculateQuote = (amount: string, exchangeRate: number): Partial<QuoterResponse> => {
  const srcTokenAmount = amount;
  const dstTokenAmount = (BigInt(amount) * BigInt(exchangeRate)).toString();

  return {
    srcTokenAmount,
    dstTokenAmount,
    autoK: 1,
    prices: {
      usd: {
        srcToken: '2577.6314', // Mock USD price, replace with real price feed
        dstToken: '0.9996849753143391',
      },
    },
    volume: {
      usd: {
        srcToken: (parseFloat(srcTokenAmount) / 1e18).toFixed(2),
        dstToken: (parseFloat(dstTokenAmount) / 1e18).toFixed(2),
      },
    },
  };
};

// Generate preset configurations
const generatePresets = (dstTokenAmount: string): { fast: Preset; medium: Preset; slow: Preset } => {
  const basePreset = {
    auctionStartAmount: (BigInt(dstTokenAmount) + BigInt(881530)).toString(),
    startAmount: dstTokenAmount,
    auctionEndAmount: (BigInt(dstTokenAmount) - BigInt(1288973)).toString(),
    exclusiveResolver: null,
    costInDstToken: '881530',
    initialRateBump: 84909,
    startAuctionIn: 24,
    allowPartialFills: false,
    allowMultipleFills: false,
    gasCost: {
      gasBumpEstimate: 34485,
      gasPriceEstimate: '1171',
    },
    secretsCount: 1,
  };

  return {
    fast: { ...basePreset, auctionDuration: 180, points: [{ delay: 120, coefficient: 63932 }, { delay: 60, coefficient: 34485 }] },
    medium: { ...basePreset, auctionDuration: 360, points: [{ delay: 360, coefficient: 34485 }] },
    slow: { ...basePreset, auctionDuration: 600, points: [{ delay: 600, coefficient: 34485 }] },
  };
};

// Express route handler
const quoteHandler = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const validationResult = quoteSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.issues });
    }

    const { srcChain, dstChain, srcTokenAddress, dstTokenAddress, amount, walletAddress } = req.body;

    // Validate chain IDs
    if (!config.allowedChainIds.includes(srcChain) || !config.allowedChainIds.includes(dstChain)) {
      return res.status(400).json({ error: 'Invalid source or destination chain ID' });
    }

    // Check if quote already exists
    const existingQuote = db.data.quotes.find(
      (q: QuoterResponse) =>
        q.srcTokenAmount === amount &&
        q.srcChain === srcChain &&
        q.dstChain === dstChain &&
        q.srcTokenAddress === srcTokenAddress &&
        q.dstTokenAddress === dstTokenAddress &&
        q.walletAddress === walletAddress
    );

    if (existingQuote) {
      return res.status(200).json(existingQuote);
    }

    // Calculate quote details
    const exchangeRate = getExchangeRate(srcTokenAddress, dstTokenAddress);
    const quoteDetails = calculateQuote(amount, exchangeRate);

    // Generate response
    const response: QuoterResponse = {
      quoteId: uuidv4(),
      srcChain,
      dstChain,
      srcTokenAddress,
      dstTokenAddress,
      walletAddress,
      ...quoteDetails,
      presets: generatePresets(quoteDetails.dstTokenAmount),
      timeLocks: {
        srcWithdrawal: 36,
        srcPublicWithdrawal: 336,
        srcCancellation: 492,
        srcPublicCancellation: 612,
        dstWithdrawal: 180,
        dstPublicWithdrawal: 300,
        dstCancellation: 420,
      },
      srcEscrowFactory: config.srcEscrowFactory,
      dstEscrowFactory: config.dstEscrowFactory,
      srcSafetyDeposit: config.srcSafetyDeposit,
      dstSafetyDeposit: config.dstSafetyDeposit,
      whitelist: config.whitelist,
      recommendedPreset: 'fast',
    };

    // Store quote in LowDB
    db.data.quotes.push(response);
    await db.write();

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating quote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Express router setup
const router = express.Router();
router.post('/quote/receive', quoteHandler);

export default router;
