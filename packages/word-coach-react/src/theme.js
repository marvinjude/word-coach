export const themes = {
  dark: {
    colors: {
      primary: "#292D3E",
      foreground: "#BFC7D5",
      secondary: "#ebf8ff",
      container: {
        background: "#292D3E",
        border: "transparent",
        foreground: "#BFC7D5",
      },
      highlighter: {
        wrong: "red",
        right: "green",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "#ebf8ff",
            text: "white",
            background: "transparent",
          },
          right: {
            border: "#ebf8ff",
            text: "white",
            background: "yellow",
          },
          wrong: {
            border: "#ebf8ff",
            text: "red",
            background: "orange",
          },
        },
      },
    },
  },
  blacknwhite: {
    colors: {
      primary: "black",
      foreground: "white",
      secondary: "red",
      container: {
        background: "black",
        border: "transparent",
        foreground: "#ebf8ff",
      },
      highlighter: {
        wrong: "red",
        right: "green",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "gray",
            text: "white",
            background: "transparent",
          },
          wrong: {
            border: "transparent",
            text: "white",
            background: "orange",
          },
          right: {
            border: "transparent",
            text: "white",
            background: "green",
          },
        },
      },
    },
  },
  blue: {
    colors: {
      primary: "white",
      foreground: "black",
      secondary: "#2F80ED",
      container: {
        background: "white",
        border: "white",
        foreground: "black",
      },
      highlighter: {
        wrong: "#b80808",
        right: "#2F80ED",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "#2F80ED",
            text: "#2F80ED",
            background: "white",
          },
          wrong: {
            border: "#b80808",
            text: "white",
            background: "#b80808",
          },
          right: {
            border: "#ebf8ff",
            text: "white",
            background: "#2F80ED",
          },
        },
      },
    },
  },
  palenight: {
    colors: {
      primary: "#292D3E",
      foreground: "#BFC7D5",
      secondary: "#ebf8ff",
      container: {
        background: "#292D3E",
        border: "black",
        foreground: "#BFC7D5",
      },
      highlighter: {
        wrong: "red",
        right: "green",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "#ebf8ff29",
            text: "#ffffff",
            background: "#2e334b",
          },
          wrong: {
            border: "#ebf8ff29",
            text: "",
            background: "red",
          },
          right: {
            border: "#ebf8ff29",
            text: "white",
            background: "green",
          },
        },
      },
    },
  },
  nigeria: {
    colors: {
      primary: "white",
      foreground: "black",
      secondary: "#48bb78",
      container: {
        background: "white",
        border: "white",
        foreground: "black",
      },
      highlighter: {
        wrong: "#b80808",
        right: "green",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "#018000",
            text: "black",
            background: "",
          },
          wrong: {
            border: "#b80808",
            text: "white",
            background: "#b80808",
          },
          right: {
            border: "#ebf8ff",
            text: "white",
            background: "green",
          },
        },
      },
    },
  },
  cobalt: {
    colors: {
      primary: "#193549",
      foreground: "#BFC7D5",
      secondary: "#ffc600",
      container: {
        background: "#193549",
        border: "transparent",
        foreground: "#BFC7D5",
      },
      highlighter: {
        wrong: "red",
        right: "green",
        unanswered: "#bdc1c6",
      },
      option: {
        button: {
          unanswered: {
            border: "#ffc60030",
            text: "#ffffff",
            background: "#0b2233",
          },

          right: {
            border: "#ebf8ff",
            text: "",
            background: "green",
          },
          wrong: {
            border: "#ebf8ff",
            text: "",
            background: "red",
          },
        },
      },
    },
  },
}

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
}

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
}
