import { DEFAULT_THEME } from "./constants"
import { themes } from "./themes"

const THEME_ELEMENT_ID = "theme-for-word-coach"

export type Themes = keyof typeof themes

/**
 * @param themeKey - key of theme to be injected
 * @example
 * const themeString = getThemeString("nigeria")
 * // --primary: #0000  --secondary: #0000 ...
 * @returns
 */
export function getThemeString(themeKey: Themes) {
  const themeObject = themes[themeKey] || themes[DEFAULT_THEME]
  const themeString = Object.keys(themeObject)
    .map(key => {
      return `--${key}: ${themeObject[key as keyof typeof themeObject]}`
    })
    .join(";")

  return themeString
}
/**
 * @param themeKey - key of theme to be injected
 * @param element - element to be injected with theme
 */
export function injectThemeIntoElement(
  themeKey: Themes = "nigeria",
  element: HTMLElement
): void {
  const themeObject = themes[themeKey] || themes[DEFAULT_THEME]
  Object.keys(themeObject).forEach(key => {
    element.style.setProperty(
      `--${key}`,
      themeObject[key as keyof typeof themeObject]
    )
  })
}

/**
 * @param themeKey - key of theme to be injected
 */
export function injectThemeElement(themeKey: Themes): void {
  const style = document.createElement("style")
  style.setAttribute("data-theme", "theme-for-word-coach")
  document.head.appendChild(style)

  const themeString = getThemeString(themeKey)
  style.innerHTML = `
   :root{
      ${themeString}
    }
  `
}

/**
 * Removes theme element from DOM
 */
export function removeThemeElement(): void {
  const element = document.querySelector(`[data-theme=${THEME_ELEMENT_ID}]`)
  if (element) {
    element.remove()
  }
}

/**
 * @param baseClassName - base class name
 * @param conditionals - object with class names as keys and boolean values
 * @returns
 */
export function classNames(
  baseClassName: string,
  conditionals: { [className: string]: boolean }
): string {
  const classList = [baseClassName]

  for (const className in conditionals) {
    if (conditionals[className]) {
      classList.push(className)
    }
  }

  return classList.join(" ")
}

/**
 * Shuffles array
 * @param arr - array to be shuffled
 * @example
 * const shuffledArray = shuffleArray([1,2,3,4,5])
 * // [2, 5, 3, 1, 4]
 * @returns
 */
export function shuffleArray(arr: any[]): any[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
