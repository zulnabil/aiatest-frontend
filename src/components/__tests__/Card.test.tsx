import React from "react"
import { render } from "@testing-library/react"
import CardImage from "../Card"
import { stringToDate } from "functions/utility"

it("Card image component rendered properly", () => {
  const _expected = {
    loading: false,
    media: {
      m: "https://live.staticflickr.com/65535/50824076223_c42f951c75_m.jpg",
    },
    title: "Erpel im Doppelpack ziehen vorbei",
    date_taken: "2020-12-20T17:44:03-08:00",
  }

  const { getByText, getByAltText } = render(<CardImage {..._expected} />)
  expect(getByText(_expected.title)).toBeInTheDocument()
  expect(
    getByText("Taken " + stringToDate(_expected.date_taken))
  ).toBeInTheDocument()
  expect(getByAltText("example")).toHaveAttribute("src", _expected.media.m)
})
