import { createGlideConfig, listPaymentOptions } from '@paywithglide/glide-js'
import type { Address } from 'viem'
import {
    createPublicClient,
    createWalletClient,
    encodeFunctionData,
    erc20Abi,
    http,
    parseEther,
    parseUnits,
    publicActions,
    type EncodeFunctionDataParameters,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
import type { airdropChains } from '..'
type Configuration = {
    operatorPrivateKey: string
    chain: keyof typeof airdropChains
    paymentAmount: number
    receiverAddress: string
    tokenAddress: string
    walletAddress: string
}
export const chainKeyToChain = {
    mainnet: mainnet,
    arbitrum: arbitrum,
    base: base,
    optimism: optimism,
    polygon: polygon,
}
const GLIDE_PROJECT_ID = process.env.GLIDE_PROJECT_ID || process.env.NEXT_PUBLIC_GLIDE_PROJECT_ID
export const glideConfig = createGlideConfig({
    projectId: GLIDE_PROJECT_ID!,
    chains: Object.values(chainKeyToChain),
})

export async function transferTokenToAddress(configuration: Configuration) {
    const {
        operatorPrivateKey,
        chain,
        tokenAddress,
        walletAddress,
        receiverAddress,
        paymentAmount,
    } = configuration

    const account = privateKeyToAccount(operatorPrivateKey as Address)

    const walletClient = createWalletClient({
        chain: chain == 'ethereum' ? chainKeyToChain['mainnet'] : chainKeyToChain[chain],
        transport: http(),
        account,
    }).extend(publicActions)
    const args = [walletAddress, receiverAddress, parseEther(`${paymentAmount}`)]
    const functionName = 'transferFrom'

    const data = encodeFunctionData({
        abi: erc20Abi,
        functionName,
        args,
    } as EncodeFunctionDataParameters)
    try {
        const txHash = await walletClient.sendTransaction({
            to: tokenAddress as Address,
            data,
        })
        console.log(txHash)
        return txHash
    } catch (error) {
        console.log('Something went wrong sending tokens to address')
        return null
    }
}
export async function getContractDetails(
    chain: keyof typeof chainKeyToChain,
    contractAddress: Address
) {
    const client = createPublicClient({
        chain: chainKeyToChain[chain],
        transport: http(),
    })

    try {
        const [name, symbol] = await Promise.all([
            client.readContract({
                address: contractAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: 'name',
            }),
            client.readContract({
                address: contractAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: 'symbol',
            }),
        ])

        return { name, symbol }
    } catch (error) {
        console.error('Error fetching token details:', error)
        return null
    }
}

export async function getCrossChainTokenDetails(
    chain: keyof typeof chainKeyToChain,
    contractAddress: Address,
    tokenSymbol?: string
) {
    const GLIDE_PROJECT_ID =
        process.env.GLIDE_PROJECT_ID || process.env.NEXT_PUBLIC_GLIDE_PROJECT_ID
    console.log(GLIDE_PROJECT_ID)
    if (!GLIDE_PROJECT_ID) {
        throw new Error('GLIDE_PROJECT_ID is not set')
    }
    const chainId = chainKeyToChain[chain].id
    const dummyRecepientAddress = '0x8ff47879d9eE072b593604b8b3009577Ff7d6809'
    try {
        const amount = tokenSymbol?.toLowerCase() === 'usdc' ? parseUnits('1', 6) : parseEther('1')
        const paymentOptions = await listPaymentOptions(glideConfig, {
            chainId,
            address: contractAddress,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [dummyRecepientAddress, amount],
        })

        return paymentOptions
    } catch (error) {
        console.error('Error fetching token details:', error)
        return null
    }
}

export interface Token {
    balance: string
    balanceUSD: string
    chainId: string
    chainLogoUrl: string
    chainName: string
    currencyLogoURL: string
    currencyLogoUrl: string
    currencyName: string
    currencySymbol: string
    paymentAmount: string
    paymentAmountUSD: string
    paymentCurrency: string
    totalFeeUSD: string
    transactionAmount: string
    transactionAmountUSD: string
    transactionCurrency: string
    transactionCurrencyLogoUrl: string
    transactionCurrencyName: string
    transactionCurrencySymbol: string
}
