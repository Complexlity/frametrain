"use server";
import type { BuildFrameData, FramePayloadValidated } from "@/lib/farcaster";
import { runGatingChecks } from "@/lib/gating";
import { FrameError } from "@/sdk/error";
import BasicView from "@/sdk/views/BasicView";
import type { Config, Storage } from "..";
import { transferTokenToAddress } from "../utils/transerToAddress";
import ClaimedView from "../views/Claimed";

export default async function page({
  body,
  config,
  storage,
  params,
}: {
  body: FramePayloadValidated;
  config: Config;
  storage: Storage;
  params: any;
}): Promise<BuildFrameData> {
  const {
    blacklist,
    whitelist,
    creatorId: creatorFid,
    generalAmount,
    enableGating,
    cooldown,
    chain,
    walletAddress,
    tokenAddress,
  } = config;
  console.log(body.interactor);
  console.log(config);
  const { fid, verified_addresses } = body.interactor;
  const viewerFid = 1;

  let paymentAmount = generalAmount;
  let viewerFromStorage;
  //users.viewerFid could also not be present
  console.log("In claim route");

  if (!storage.users) {
    storage.users = {};
    viewerFromStorage = undefined;
  } else {
    console.log(storage.users);
    storage.users = {
      "1": {
        claimed: true,
        lastUsage: 1728375487336,
        username: "frametrain",
        fid: "1",
        earnings: 20,
      },
      "213144": {
        claimed: true,
        lastUsage: 1728374460860,
        username: "complexlity",
        fid: "213144",
        earnings: 40,
      },
    };
    viewerFromStorage = storage.users?.[viewerFid];
  }
  console.log("viewerFromStorage", viewerFromStorage);
  if (enableGating) {
    await runGatingChecks(body, config.gating);
  }

  //Check cool down time is not expired
  console.log(cooldown);
  if (cooldown > -1) {
    console.log("I am here first");
    const now = Date.now();

    const lastUsage = viewerFromStorage?.lastUsage || 0;
    const cooldownMs = cooldown * 1000;
    const cooldownEndTime = lastUsage + cooldownMs;

    if (now < cooldownEndTime) {
      const timeLeftInSeconds = Math.ceil((cooldownEndTime - now) / 1000);
      throw new FrameError(`Cooldown. claim again in: ${timeLeftInSeconds}s`);
    }
  }

  //Check if user has already claimed
  else if (viewerFromStorage?.claimed) {
    console.log("I am here second");
    throw new FrameError("You can only claim once!");
  }

  console.log(viewerFid, creatorFid);
  if (viewerFid == creatorFid) {
    //User is creator so return the approve screen
    return {
      buttons: [
        {
          label: "Approve",
          action: "tx",
          handler: "tx",
        },
      ],
      component: BasicView({
        ...config.cover,
        title: { text: "Approve" },
        subtitle: {
          text: "Approve our operator to spend tokens on your behalf",
        },
      }),
      handler: "approve",
    };
  }

  //   const viewerAddresses = verified_addresses.eth_addresses;
  const viewerAddresses = ["0xd23F4658351CBc8cE60571d2608Ac125191079ec"];
  //Get blacklist, whitelist or claimed
  for (let i = 0; i < viewerAddresses.length; i++) {
    const address = viewerAddresses[i];
    //Check blacklist
    if (blacklist.includes(address)) {
      throw new FrameError("You're not eligible to claim");
    }
    //Check whitelist
    const userInWhiteList = whitelist.find((item) => item.address === address);
    if (!!userInWhiteList) {
      paymentAmount = userInWhiteList.amount ?? generalAmount;
      //No need for a user to be in both black and whitelist so just break
      break;
    }
  }

  //Send airdrop amount to user
  const FRAME_TRAIN_OPERATOR_PRIVATE_KEY =
    process.env.FRAME_TRAIN_OPERATOR_PRIVATE_KEY;
  if (!FRAME_TRAIN_OPERATOR_PRIVATE_KEY) {
    throw new FrameError("Frame operator details missing is not set");
  }
  const configuration = {
    operatorPrivateKey: FRAME_TRAIN_OPERATOR_PRIVATE_KEY,
    chain: chain,
    paymentAmount,
    receiverAddress: viewerAddresses[0] ?? body.interactor.custody_address,
    tokenAddress,
    walletAddress,
  };
  // console.log({ configuration });
  console.log("Transfering token to address...");
  transferTokenToAddress(configuration);

  //Update storage
  const newStorage = {
    ...storage,
    users: {
      ...storage.users,
      [viewerFid]: {
        claimed: true,
        lastUsage: Date.now(),
        username: body.interactor.username,
        fid: viewerFid,
        earnings: viewerFromStorage?.earnings
          ? viewerFromStorage.earnings + paymentAmount
          : paymentAmount,
      },
    },
    totalAmountEarned: (storage.totalAmountEarned ?? 0) + paymentAmount,
  };

  console.log(newStorage);
  return {
    buttons: [
      {
        label: "Home 🏡",
      },
    ],
    storage: newStorage,
    component: ClaimedView(),
    handler: "initial",
  };
}
