import { DEFAULT_THEME } from "./constants"
import { themes } from "./themes"

const THEME_ELEMENT_ID = "theme-for-word-coach"

export type Themes = keyof typeof themes

/**
 * Use this if there are other ways you'd want to utilize the theme string
 * @param themeKey - key of theme to be injected
 * @example
 * const themeString = getThemeString("nigeria")
 * // --primary: #0000  --secondary: #0000 ...
 * @returns
 */
export function getThemeString(themeKey: Themes = DEFAULT_THEME) {
  const themeObject = themes[themeKey]
  const themeString = Object.keys(themeObject)
    .map(key => {
      return `--${key}: ${themeObject[key as keyof typeof themeObject]}`
    })
    .join(";")

  return themeString
}
/**
 * Instead of putting a 'style' tag into the document head with the theme,
 * this function injects the into into the style property of the specified element so that it's children can inherit the theme
 * @param element - element to be injected with theme
 * @param themeKey - key of theme to be injected
 */
export function injectThemeIntoElement(
  element: HTMLElement,
  themeKey: Themes = DEFAULT_THEME
): void {
  const themeObject = themes[themeKey]

  Object.keys(themeObject).forEach(key => {
    element.style.setProperty(
      `--${key}`,
      themeObject[key as keyof typeof themeObject]
    )
  })
}

/**
 * Injects a style tag into document head with the specified theme
 * @param themeKey - key of theme to be injected
 */
export function injectStyleTagWithThemeVars(
  themeKey: Themes = DEFAULT_THEME
): void {
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
 * Removes theme element previously injected into DOM by injectStyleTagWithThemeVars()
 */
export function removeStyleTagWithThemeVars(): void {
  const element = document.querySelector(`[data-theme=${THEME_ELEMENT_ID}]`)
  if (element) {
    element.remove()
  }
}

/**
 * Concatenates class names based on conditionals
 * @param baseClassName - base class name
 * @param conditionals - object with class names as keys and boolean values
 * @example
 * const className = classNames("base-class", { "class-1": true, "class-2": false })
 * // "base-class class-1"
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
