'use client'

import { Input } from '@/components/shadcn/Input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/Select'
import { Slider } from '@/components/shadcn/Slider'
import { type ReactNode, useState } from 'react'
import toast from 'react-hot-toast'
import { useUploadImage } from '../hooks'
import { ColorPicker } from './ColorPicker'
import { FontFamilyPicker } from './FontFamilyPicker'
import { FontStylePicker } from './FontStylePicker'
import { FontWeightPicker } from './FontWeightPicker'
import type { TextSlideProps, TextSlideStyle } from './TextSlide'

type TextSlideStyleConfigProps = {
    name: string
    config: TextSlideStyle | undefined
    background?: string
    setBackground?: (color: string) => void
    updateConfig: (updatedStyle: TextSlideStyle) => void
}

type TextSlideEditorProps = {
    name: string
    title: TextSlideProps['title']
    titleName?: string
    subtitle: TextSlideProps['subtitle']
    subtitleName?: string
    bottomMessage?: TextSlideProps['bottomMessage']
    bottomMessageName?: string
    background?: string
    onUpdate: (updatedSlide: TextSlideProps) => void
    children?: ReactNode
}

export default function TextSlideEditor({
    name,
    titleName = 'Title',
    subtitleName = 'Subtitle',
    bottomMessageName = 'Custom Message',
    onUpdate,
    ...slide
}: TextSlideEditorProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col w-full">
                    <h2 className="text-lg">{name} Title</h2>
                    <Input
                        className="py-2 text-lg"
                        defaultValue={slide.title?.text}
                        onChange={async (e) => {
                            const text = e.target.value.trim()
                            if (text === '') {
                                toast.error(`Please enter a ${name} title`)
                                return
                            }
                            onUpdate({
                                ...slide,
                                title: { ...slide.title, text },
                            })
                        }}
                        placeholder={`${name} title`}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <h2 className="text-lg">{name} Subtitle</h2>
                    <Input
                        className="py-2 text-lg"
                        defaultValue={slide?.subtitle?.text}
                        onChange={async (e) => {
                            const text = e.target.value.trim()
                            if (text === '') {
                                toast.error(`Please enter a ${name} subtitle`)
                                return
                            }

                            onUpdate({
                                ...slide,
                                subtitle: { ...slide.subtitle, text },
                            })
                        }}
                        placeholder={`${name} subtitle`}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <h2 className="text-lg">{name} Bottom Message</h2>
                    <Input
                        className="py-2 text-lg"
                        defaultValue={slide?.bottomMessage?.text}
                        onChange={async (e) => {
                            const value = e.target.value.trim()
                            onUpdate({
                                ...slide,
                                bottomMessage: {
                                    ...slide.bottomMessage,
                                    text: value === '' ? undefined : value,
                                },
                            })
                        }}
                        placeholder="your custom message"
                    />
                </div>
            </div>
            {slide.children}
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg text-center">{name} customizations</h2>
                <TextSlideStyleConfig
                    name={titleName}
                    background={slide.background}
                    config={slide.title || {}}
                    updateConfig={(style) => {
                        onUpdate({
                            ...slide,
                            title: {
                                text: slide.title?.text,
                                ...style,
                            },
                        })
                    }}
                    setBackground={(background) => {
                        onUpdate({ ...slide, background })
                    }}
                />
                <TextSlideStyleConfig
                    name={subtitleName}
                    config={slide.subtitle || {}}
                    updateConfig={(style) => {
                        onUpdate({
                            ...slide,
                            subtitle: {
                                ...slide.subtitle,
                                ...style,
                            },
                        })
                    }}
                />
                <TextSlideStyleConfig
                    name={bottomMessageName}
                    config={slide.bottomMessage || {}}
                    updateConfig={(style) => {
                        onUpdate({
                            ...slide,
                            bottomMessage: {
                                ...slide.bottomMessage,
                                ...style,
                            },
                        })
                    }}
                />
            </div>
        </div>
    )
}

export const TextSlideStyleConfig = ({
    name,
    background = '#000000',
    config = {},
    updateConfig,
    setBackground,
}: TextSlideStyleConfigProps) => {
    const uploadImage = useUploadImage()
    const [fontSize, setFontSize] = useState(config?.fontSize || 50)
    return (
        <>
            {setBackground ? (
                <div className="flex flex-col gap-2 w-full">
                    <h2 className="text-lg font-semibold">Slide background</h2>
                    <ColorPicker
                        className="w-full"
                        enabledPickers={['solid', 'gradient', 'image']}
                        background={background}
                        setBackground={(bg) => {
                            setBackground(bg)
                        }}
                        uploadBackground={async (base64String, contentType) => {
                            const { filePath } = await uploadImage({
                                base64String: base64String,
                                contentType: contentType,
                            })

                            return filePath
                        }}
                    />
                </div>
            ) : null}
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold">{name} Color</h2>
                <ColorPicker
                    className="w-full"
                    background={config?.color || 'white'}
                    setBackground={(color) => {
                        updateConfig({ ...config, color })
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-semibold">
                    {name} Size ({fontSize}px)
                </label>

                <Slider
                    defaultValue={[fontSize]}
                    max={140}
                    step={2}
                    onValueChange={(newRange) => {
                        const size = newRange[0]
                        setFontSize(size)
                        updateConfig({ ...config, fontSize: size })
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold">{name} Font</h2>
                <FontFamilyPicker
                    defaultValue={config?.fontFamily || 'Roboto'}
                    onSelect={(fontFamily) => {
                        updateConfig({ ...config, fontFamily })
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold">{name} Style</h2>
                <FontStylePicker
                    currentFont={config?.fontFamily || 'Roboto'}
                    defaultValue={config?.fontStyle || 'normal'}
                    onSelect={(fontStyle: string) => {
                        updateConfig({ ...config, fontStyle })
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold">{name} Weight</h2>
                <FontWeightPicker
                    currentFont={config?.fontFamily || 'Roboto'}
                    defaultValue={config?.fontWeight || 'normal'}
                    onSelect={(fontWeight) => {
                        updateConfig({ ...config, fontWeight })
                    }}
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-lg font-semibold">{name} Position</h2>
                <Select
                    defaultValue={config?.position || 'center'}
                    onValueChange={(position: 'left' | 'center' | 'right') => {
                        updateConfig({ ...config, position })
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Left" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={'left'}>Left</SelectItem>
                        <SelectItem value={'center'}>Center</SelectItem>
                        <SelectItem value={'right'}>Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}
