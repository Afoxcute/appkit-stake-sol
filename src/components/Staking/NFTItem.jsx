import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useTheme } from "../ThemeProvider";
import { unvestNft, vestNft } from "../../contracts/NFTVesting/nft-vesting";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { toast } from "react-toastify";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";

import { unstakeNft, stakeNft } from "../../contracts/NFTstaking/nft-staking";

const NFTItem = ({ img, name, mint, isStaked, isStaking, onfetchAll }) => {
  const { isDarkMode } = useTheme();
  const [staked, setStaked] = useState(true);

  useEffect(() => {
    setStaked(isStaked);
  }, [isStaked]);

  const SOLANA_HOST = clusterApiUrl("mainnet-beta");
  const connection = new anchor.web3.Connection(SOLANA_HOST);

  const wallet = useWallet();

  async function onStake() {
    const selectedNftMint = [];
    selectedNftMint.push(mint);
    try {
      let txHash = await stakeNft(wallet, connection, selectedNftMint);
      if (txHash.result == "success") {
        showToast("Stake Success", 3500);
        setStaked(!staked);
        onfetchAll();
      } else {
        showToast("Stake Failed", 3500, 1);
      }

      console.log(txHash);
    } catch (e) {
      console.error(e);
    }
  }

  async function onUnstake() {
    const selectedNftMint = [];
    selectedNftMint.push(mint);
    try {
      let txHash = await unstakeNft(wallet, connection, selectedNftMint);
      if (txHash.result == "success") {
        showToast("Unstake Success", 3500);
        setStaked(!staked);
      } else {
        showToast("Unstake Failed", 3500, 1);
      }
      onfetchAll();
    } catch (e) {
      console.error(e);
    }
  }

  async function onVesting() {
    const selectedNftMint = [];
    selectedNftMint.push(mint);
    try {
      let txHash = await vestNft(wallet, connection, selectedNftMint);
      if (txHash.result == "success") {
        showToast("Vesting Success", 3500);
        setStaked(!staked);
      } else {
        showToast("Vesting Failed", 3500, 1);
      }
      onfetchAll();
      console.log(txHash);
    } catch (e) {
      console.error(e);
    }
  }

  async function onUnvesting() {
    const selectedNftMint = [];
    selectedNftMint.push(mint);
    try {
      let txHash = await unvestNft(wallet, connection, selectedNftMint);
      if (txHash.result == "success") {
        showToast("Time Lock, Please wait", 2000);
        setStaked(!staked);
      } else {
        showToast("Time Lock, Please wait", 2000, 1);
      }
      onfetchAll();
      console.log(txHash);
    } catch (e) {
      console.error(e);
    }
  }

  const showToast = (txt, duration = 5000, ty = 0) => {
    let type = toast.TYPE.SUCCESS;
    if (ty === 1) type = toast.TYPE.ERROR;
    if (ty === 2) type = toast.TYPE.INFO;

    let autoClose = duration;
    if (duration < 0) {
      autoClose = false;
    }
    return toast.error(txt, {
      position: "bottom-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      type,
      theme: "colored",
    });
  };

  return (
    <div className="dark:bg-[#493121] bg-[#FFE5CF] rounded-lg  flex flex-col items-start justify-start p-3 gap-3 mx-2">
      <img
        className="w-56 rounded-3xs h-56 overflow-hidden object-cover"
        alt=""
        src={img}
      />
      <div className=" font-semibold dark:text-white text-title-light">
        {name}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-3 text-xs">
        <div className="w-full flex flex-col items-start justify-start gap-2 text-base dark:text-white text-title-light">
          <div className="w-full h-11">
            {isStaking === "Staking" ? (
              <Button
                text={staked ? "Unstake" : "Stake"}
                onClick={
                  staked
                    ? () => {
                        onUnstake();
                      }
                    : () => {
                        onStake();
                      }
                }
              />
            ) : (
              <Button
                text={staked ? "Unvest" : "Vest"}
                onClick={
                  staked
                    ? () => {
                        onUnvesting();
                      }
                    : () => {
                        onVesting();
                      }
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTItem;
