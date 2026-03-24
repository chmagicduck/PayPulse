import { highContrastTheme } from './themes/high-contrast'
import { oceanDefaultTheme } from './themes/ocean-default'
import { sunriseTheme } from './themes/sunrise'
import type { SemanticTheme } from './semantic'

export const themes: SemanticTheme[] = [
  oceanDefaultTheme,
  sunriseTheme,
  highContrastTheme,
]

export const defaultThemeId = oceanDefaultTheme.id

export function getThemeById(themeId: string) {
  return themes.find(theme => theme.id === themeId) || oceanDefaultTheme
}
