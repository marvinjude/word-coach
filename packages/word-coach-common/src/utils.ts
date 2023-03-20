import { DEFAULT_THEME } from "./constants"
import { themes } from "./themes"

const THEME_ELEMENT_ID = "theme-for-word-coach"

export function getThemeString(themeKey: keyof typeof themes) {
  const themeObject = themes[themeKey] || themes[DEFAULT_THEME]
  const themeString = Object.keys(themeObject)
    .map(key => {
      return `--${key}: ${themeObject[key as keyof typeof themeObject]}`
    })
    .join(";")

  return themeString
}

export function injectThemeIntoElement(
  themeKey: keyof typeof themes = "nigeria",
  element: HTMLElement
) {
  const theme = themes[themeKey] || themes[DEFAULT_THEME]
  Object.keys(theme).forEach(key => {
    element.style.setProperty(`--${key}`, theme[key as keyof typeof theme])
  })
}

export function injectThemeElement(themeKey: keyof typeof themes) {
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

export function removeThemeElement() {
  const element = document.querySelector(`[data-theme=${THEME_ELEMENT_ID}]`)
  if (element) {
    element.remove()
  }
}

export function classNames(
  baseClassName: string,
  conditionals: { [className: string]: boolean }
) {
  const classList = [baseClassName]

  for (const className in conditionals) {
    if (conditionals[className]) {
      classList.push(className)
    }
  }

  return classList.join(" ")
}
