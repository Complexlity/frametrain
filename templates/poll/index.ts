import type { BaseConfig, BaseStorage, BaseTemplate } from '@/lib/types'
import type { GatingType } from '@/sdk/components/gating/GatingInspector'
import Inspector from './Inspector'
import cover from './cover.avif'
import handlers from './handlers'
import icon from './icon.avif'

export interface Config extends BaseConfig {
    owner: {
        username: string
        fid: number
    } | null
    options: {
        buttonLabel: string
        displayLabel: string
        index: number
    }[]
    question: string
    background?: string
    textColor?: string
    barColor?: string
    gating: GatingType | undefined
    enableGating?: boolean
}

export interface Storage extends BaseStorage {
    votesForId: Record<string, { option: number; username: string; timestamp: number }>
    votesForOption: Record<string, number>
    totalVotes: number
}

export default {
    name: 'Poll',
    description: 'Your very own customizable Poll, now as a Farcaster Frame.',
    shortDescription: 'Customizable Polls',
    octicon: 'question',
    icon: icon,
    creatorFid: '3',
    creatorName: 'Dan',
    enabled: true,
    Inspector,
    handlers,
    cover,
    requiresValidation: true,
    initialConfig: {
        owner: null,
        enableGating: false,
        gating: {
            requirements: {
                channels: [],
                followedByMe: false,
                followingMe: false,
                liked: false,
                recasted: false,
                eth: false,
                sol: false,
                powerBadge: false,
                maxFid: 0,
                score: 0,
                erc20: [],
                erc721: [],
                erc1155: [],
            },
        },
    },
    events: [],
} satisfies BaseTemplate
