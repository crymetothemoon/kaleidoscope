import React from "react"
import { DEFAULT_STATE, PRESETS } from "./game-constants"
import { GoExports, Instantiate } from "./interlope"
import { NewI18n } from "./domain_agnostic/i18n"
import { NewStateStore } from "./redux/state"
import { Page } from "./components/page"
import { PageLoaded, WasmLoaded } from "./redux/thunk-actions"
import { render } from "react-dom"
import { shuffle } from "nda/dist/isomorphic/rand"
import { lang } from "./deps"

const go = async () => {
  const { run, retrieve } = await Instantiate("main.wasm")
  run()
  const NewVertices: GoExports["NewVertices"] = retrieve("NewVertices")
  const NewRestriction: GoExports["NewRestriction"] = retrieve("NewRestriction")
  const NewCompression: GoExports["NewCompression"] = retrieve("NewCompression")
  const NewDots: GoExports["NewDots"] = retrieve("NewDots")
  const NewVertex: GoExports["NewVertex"] = retrieve("NewVertex")
  const RequestDrawingInstructions: GoExports["RequestDrawingInstructions"] = retrieve(
    "RequestDrawingInstructions",
  )
  return {
    NewVertices,
    NewRestriction,
    NewCompression,
    NewDots,
    NewVertex,
    RequestDrawingInstructions,
  }
}

const main = async () => {
  const randomPresets = shuffle(PRESETS)
  const store = NewStateStore(DEFAULT_STATE)
  ;(async () => {
    const exports = await go()
    store.dispatch(WasmLoaded(exports))
    store.dispatch(PageLoaded(randomPresets))
  })()
  const Lang = NewI18n(lang, true)
  const div = document.body.appendChild(document.createElement("div"))
  store.subscribe(() =>
    render(
      <Page
        Lang={Lang}
        store={store}
        presets={PRESETS}
        resizeThrottle={50}
        minLeftPanel={0.15}
        maxLeftPanel={0.2}
        minRightPanel={0.15}
        maxRightPanel={0.2}
      />,
      div,
    ),
  )
  store.dispatch({ type: "DOM-loaded" })
}

main()