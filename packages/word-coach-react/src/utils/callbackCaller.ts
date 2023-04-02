/**
 * @param {Function} callback - The callback function to be called
 * @param {any} values - The values to be passed to the callback function
 */
function callbackCaller(callback: Function | undefined, values?: any) {
  if (typeof callback === "function") {
    if (values !== undefined) {
      callback(values)
    } else {
      callback()
    }
  }
}

export default callbackCaller
