<p align="center">
  <br />
  <br />
  <br />
  <img src="./word-coach-logo.png" width="100" height="auto" alt="dropd logo" align="center" />
  <br />
  <br />
  <h3 align="center">A quiz component</h3>

  <p align="center">
  <a href="https://npm.im/dropd-component"><img src="https://img.shields.io/npm/v/dropd-component.svg?color=brightgreen&style=flat-square" alt="Package version."></a>
  <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PR(s)-welcome-brightgreen.svg?style=flat-square" alt="Make a pull request."></a>
  <a href="http://www.firsttimersonly.com"><img src="https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square" alt="First-timers Friendly"></a>
  </p>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/next">
    <img alt="" src="https://img.shields.io/npm/v/next.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/vercel/next.js/blob/canary/license.md">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>

</p>

Word Coach is simply a replica of the [Google word coach](https://www.seoexpertindelhi.in/google-word-coach/) built in React. You can see the orginal Google Word coach in action by searching "Google Word coach" on Google via **your mobile device**. This project may only be used for learning purposes as the initial idea is from Google.

## Demo

I've built an interactived demo to help you see the comp

![](Screenshot%202023-08-05%20at%2015.07.33.png)

[Go to Demo](https://wordcoach.xyz)

## Installation

```bash
yarn add @word-coah/react
```

## Contributing

All contributions are welcome, see [Projects](https://github.com/marvinjude/projects/) to see potential contributions.

To setup this project on your machine

- Fork Repo on your machine
- install pnpm globally(npm i -g pnpm)
- install packages (pnpm i)
- Watch all packages (pnpm watch)

To test the effect of code updates, you can spin up `example/wordcoach.xyz` with `pnpm start`. Any code update you make should reflect accordingly.

## 📝 License

Licensed under the [MIT License](https://github.com/marvinjude/word-coach/license.md)

## Todo

### All

- [ ] Fix Eslint

### @word-coach/react

- [x] Use streamed data over fake data
- [x] add onChunk callback
- [x] Prevent highlight overflow
- [x] Introduce modes ["stream|static"]
- [x] Prevent moving or skipping if next chunk hasn't arrived, move to next when data arrives
- [x] Cleanup themes - Make sure all themes looks nice
- [x] Fix EndGameScreen
- [x] Fetch again on "Next Round" for stream mode

- [x] Fully wire props with UI
- [ ] Back state up in localStorage
- [ ] General code cleanup
- [ ] Write test with playright
- [ ] TS type for css & svg
- [ ] Ship to NPM
- [ ] Compile to web component
- [ ] Deploy same in-react example to codesandbox(setup pipline for that)
- [ ] Switch styling solution
- [ ] Docs

### @word-coach/ai-questions

- [ ] Fix CSV parsing in Library
- [ ] Write tests
- [ ] Docs
- [ ] image fetching may messs with order of question index in stream
- [ ] Add "why answer"

### wordcoach.xyz

- [x] Build UI for mode and render based on props based on mod
- [x] Build UI for progress

- [ ] Copy Code Feature
  - [ ] React
  - [ ] Web Component
- [ ] Open on CodeSandbox
- [ ] Block Requests not coming from word-coach-xyz
- [ ] Incoporate modes
- [ ] Show stream progress in stream mode
- [ ] Debounce stremEndPoint input element
- [ ] Add Sentry to Catch Errors in Production
