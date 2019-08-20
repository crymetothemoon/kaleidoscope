import bs from "bootstrap/dist/css/bootstrap.min.css"
import ps from "./page.css"
import React from "react"
import { AccordionSection } from "./accordion"
import {
  AllowableRestrictions,
  Polygon,
  Polygons,
  Restriction,
  Speed,
  Speeds,
} from "../game-constants"
import { Classes as _ } from "../domain_agnostic/utils"
import { I18n } from "../domain_agnostic/i18n"
import { NewCompression, NewPolygon, NewRestriction, NewSpeed } from "../redux/thunk-actions"
import { Store } from "../redux/state"

type Props = {
  Lang: I18n
  store: Store
}

type InputResponder<T> = (_: React.FormEvent<T>) => void

export const GameControl = (props: Props) => {
  const {
    Lang,
    store: { fetch, dispatch },
  } = props
  const {
    game: { polygon, jumpFunction, compression, speed },
  } = fetch()

  const newPolygon: InputResponder<HTMLSelectElement> = ({ currentTarget: { value } }) =>
    dispatch(NewPolygon(Number(value) as Polygon))

  const newJumpFn: InputResponder<HTMLSelectElement> = ({ currentTarget: { value } }) =>
    dispatch(NewRestriction(Number(value)))

  const newCompression: InputResponder<HTMLInputElement> = ({ currentTarget: { value } }) =>
    dispatch(NewCompression(Number(value)))

  const newSpeed: InputResponder<HTMLSelectElement> = ({ currentTarget: { value } }) =>
    dispatch(NewSpeed(Number(value)))

  return (
    <AccordionSection id="game-control" defaultShow={true}>
      <a href="#">
        <h5>{Lang("game control")}</h5>
      </a>
      <form>
        <FormGroup htmlFor="polygon-input" label={Lang("polygon")}>
          <select
            id="polygon-input"
            className={bs.formControl}
            value={polygon}
            onChange={newPolygon}
          >
            {Polygons.map((s) => (
              <option key={s} value={s}>
                {Lang(Polygon[s])}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup htmlFor="jumpfn-input" label={Lang("jump function")}>
          <select
            id="jumpfn-input"
            className={bs.formControl}
            value={jumpFunction}
            onChange={newJumpFn}
          >
            {AllowableRestrictions[polygon].map((s) => (
              <option key={s} value={s}>
                {Lang(Restriction[s])}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup
          htmlFor="compression-input"
          label={Lang("compression ratio %@", compression.toFixed(2))}
        >
          <input
            id="compression-input"
            className={_(bs.formControlRange, bs.customRange)}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={compression}
            onChange={newCompression}
          />
        </FormGroup>
        <FormGroup htmlFor="speed-input" label={Lang("speed")}>
          <select id="speed-input" className={bs.formControl} value={speed} onChange={newSpeed}>
            {Speeds.map((s) => (
              <option key={s} value={s}>
                {Lang(Speed[s])}
              </option>
            ))}
          </select>
        </FormGroup>
      </form>
    </AccordionSection>
  )
}

type PProps = {
  htmlFor: string
  label: string
  children: React.ReactNode
}
const FormGroup = (props: PProps) => {
  const { label, htmlFor, children } = props
  return (
    <div className={bs.formGroup}>
      <label htmlFor={htmlFor} className={_(bs.fontWeightBold, ps.gameControlLabel)}>
        {label}
      </label>
      {children}
    </div>
  )
}
