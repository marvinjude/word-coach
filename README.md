<p align="center">
  <a href="https://nextjs.org">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png">
      <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" height="128">
    </picture>
    <h1 align="center">Word-Coach</h1>
  </a>
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

## Examples

We have usage examples on CodeSandbox:

- [React](https://codesandbox.com/iiheu3hg7e83)

## Installation

React:

```bash
yarn add @word-coah/react
```

## Framework specific docs

- [React](https://github.com/marvinjude/word-coach/packages/word-coach-react)

## Contributing

If you feel ambitious and you'll like to write Word Coach in another library, I'm happy to assist you in your contribution. Feel free to [send an email](mailto::marvinjudehk@gmail.com).

This project is a monorepo and each package is stored in the [packages directory](https://github.com/marvinjude/word-coach/packages/).

TODO: Write more details about contributing a package...

## 📝 License

Licensed under the [MIT License](https://github.com/marvinjude/word-coach/license.md)

## Todo

### @word-coach/react

- [x] Use streamed data over fake data
- [x] add onChunk callback
- [x] Prevent highlight overflow
- [x] Introduce modes ["stream|static"]
- [x] Prevent moving or skipping if next chunk hasn't arrived, move to next when data arrives
- [ ] Fix EndGameScreen 

- [ ] Cleanup themes - Make sure all themes looks nice
- [ ] Throw on isLoading if in stream mode
- [ ] General code cleanup
- [ ] Write test with playright
- [ ] TS type for css & svg
- [ ] Ship to NPM
- [ ] Deploy same in-react example to codesandbox(setup pipline for that)
- [ ] Switch styling solution
- [ ] Docs

### @word-coach/ai-questions
- [ ] Fix CSV parsing in Library
- [ ] Write tests
- [ ] Docs

### wordcoach.xyz
- [x] Build UI for mode and render based on props based on mode

- [ ] Build UI for progress
- [ ] Copy Code Feature
  - [ ] React
  - [ ] Web Component
- [ ] Open on CodeSandbox
- [ ] Block Requests not coming from word-coach-xyz
- [ ] Incoporate modes
- [ ] Show stream progress in stream mode
- [ ] Debounce stremEndPoint input element