'use server'
import type { BuildFrameData, FrameActionPayload, FrameButtonMetadata } from '@/lib/farcaster'
import type { Config, State } from '..'
import PageView from '../views/Page'
import initial from './initial'
import { loadGoogleFontAllVariants } from '@/sdk/fonts'

export default async function page(
    body: FrameActionPayload,
    config: Config,
    state: State,
    params: any
): Promise<BuildFrameData> {
    const nextPage =
        params?.currentPage !== undefined
            ? body.untrustedData.buttonIndex === 1
                ? Number(params?.currentPage) - 1
                : Number(params?.currentPage) + 1
            : 1

    const slideCount = (config.article?.pages ?? []).length || 1

    //console.log('slide count', slideCount)

    const buttons: FrameButtonMetadata[] = [
        {
            label: '←',
        },
    ]

    if (nextPage < slideCount) {
        buttons.push({
            label: '→',
        })
    }

    if (config.article?.url && (config.showLinkOnAllPages || nextPage === slideCount)) {
        buttons.push({
            label: 'Support the author on Medium',
            action: 'link',
            target: config.article?.url
        })
    }

    if (body.untrustedData.buttonIndex === 1 && nextPage === 0) {
        return initial(config, state)
    }

    const page = config.article?.pages[nextPage - 1]
    const georgia = await loadGoogleFontAllVariants('Georgia')

    return {
        buttons: buttons,
        aspectRatio: '1:1',
        fonts: georgia,
        component: PageView({
            page: page || [],
            currentPage: nextPage,
            slideCount: slideCount,
        }),
        functionName: 'page',
        params: {
            currentPage: nextPage,
        }
    }
}
