import type { SemanticTheme } from './semantic'

export function createComponentRecipes(theme: SemanticTheme) {
  return {
    button: {
      primary: {
        background: theme.actionPrimary,
        color: theme.actionPrimaryText,
      },
    },
    card: {
      default: {
        background: theme.surfaceCard,
        borderColor: theme.borderSubtle,
      },
    },
  }
}
