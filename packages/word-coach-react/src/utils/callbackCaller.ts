/**
 * @param {Function} callback - The callback function to be called
 * @param {any} values - The values to be passed to the callback function
 */
function callbackCaller(callback: Function, values: any) {
  if (typeof callback === "function") callback(values)
}

export default callbackCaller
