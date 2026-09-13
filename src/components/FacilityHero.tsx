import { getDict, type Locale } from '@/i18n'
import { HeroStory } from './HeroStory'

/** Hero shell. All the behaviour lives in HeroStory; copy comes from the dictionary. */
export function FacilityHero({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  return <HeroStory locale={locale} t={{ ...t.hero, quote: t.common.requestQuote }} />
}
