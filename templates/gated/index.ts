import type { BaseConfig, BaseStorage, BaseTemplate } from '@/lib/types'
import Inspector from './Inspector'
import cover from './cover.jpeg'
import handlers from './handlers'
import type { GatingERCType } from '@/sdk/components/GatingOptions'

export interface Config extends BaseConfig {
    owner: {
        username: string
        fid: number
    } | null
    welcomeText: string | null
    label: string | null
    rewardMessage: string | null
    rewardImage: string | null
    links: string[]
    requirements: {
        basic: {
            followed: boolean
            following: boolean
            liked: boolean
            casted: boolean
            eth: boolean
            sol: boolean
            power: boolean
        }
        channels: { checked: boolean; data: string[] }
        maxFid: number
        score: number
        erc20: GatingERCType | null
        erc721: GatingERCType | null
        erc1155: GatingERCType | null
    }
}

export interface Storage extends BaseStorage {}

export default {
    name: 'Gated',
    description: 'Create your own Gated Frame to reward your fans.',
    creatorFid: '260812',
    creatorName: 'Steve',
    cover,
    enabled: true,
    Inspector,
    handlers,
    initialConfig: {
        username: null,
        welcomeText: null,
        rewardMessage: null,
        label: null,
        rewardImage: null,
        links: [],
        requirements: {
            basic: {
                followed: false,
                following: false,
                liked: false,
                casted: false,
                eth: false,
                sol: false,
                power: false,
            },
            channels: {
                checked: false,
                data: [],
            },
            maxFid: 0,
            score: 0,
            erc20: null,
            erc721: null,
            erc1155: null,
        },
    },
    requiresValidation: true,
    events: [],
} satisfies BaseTemplate
