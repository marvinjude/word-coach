function debounce(cb: (args: any) => void, delay = 250) {
  let timeout: any

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

export default debounce
