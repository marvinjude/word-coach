function callbackCaller(callback, values) {
  if (typeof callback === "function") callback(values)
}

export default callbackCaller
