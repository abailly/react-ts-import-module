Sample code demonstrating issues with import from a typescript lib into a typescript/React app.
See https://stackoverflow.com/questions/51311616/imported-symbol-from-typescript-library-is-undefined

* `lib`: Contains the library `@rex/lib` which should be published to eg. verdaccio
* `app`: Contains a React app created with https://github.com/wmonk/create-react-app-typescript but with dependencies on `@rex/lib`

Code compiles fine but imported symbol `fetchFoo` is undefined in app.
