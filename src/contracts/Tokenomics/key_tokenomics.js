import { PublicKey } from "@solana/web3.js";
import {
  GLOBAL_STATE_SEED,
  PROGRAM_ID,
} from "../tokenstaking/constants";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token"

export const getGlobalStateKey = async () => {
  const [globalStateKey] = await asyncGetPda(
    [Buffer.from(GLOBAL_STATE_SEED)],
    PROGRAM_ID
  );
  return globalStateKey;
};

export const getPoolKey = async (mintKey) => {
  const [poolKey] = await asyncGetPda(
    [mintKey.toBuffer()], // mint address
    PROGRAM_ID
  );
  return poolKey;
};

export const getVaultKey = async () => {
  const [vaultKey] = await asyncGetPda(
    [Buffer.from(VAULT_SEED)],
    PROGRAM_ID
  );
  return vaultKey;
};

export const getUserKey = async (pool, authority) => {
  const [userKey] = await asyncGetPda(
    [
      pool.toBuffer(),
      authority.toBuffer()
    ],
    PROGRAM_ID
  )
  return userKey;
}

export const getRewardAccount = async (ownerPubkey, mintPk) => {
  const [vaultKey] = await asyncGetPda(
    [
      ownerPubkey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return vaultKey;
};

export const getAssociatedTokenAccount = async (ownerPubkey, mintPk) => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};


const asyncGetPda = async (seeds, programId) => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};
