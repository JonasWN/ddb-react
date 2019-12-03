import React from "react";
import { withKnobs, text } from "@storybook/addon-knobs";
import Checklist from "./checklist.entry";
import "./checklist.scss";

export default {
  title: "Apps|Checklist",
  decorators: [withKnobs({ escapeHTML: false })]
};

export function Entry() {
  return (
    <Checklist
      materialUrl={text(
        "Material URL",
        "https://lollandbib.dk/ting/object/:pid"
      )}
      authorUrl={text(
        "Author URL",
        'https://lollandbib.dk/search/ting/phrase.creator=":author"'
      )}
      removeButtonText={text("Remove button text", "Fjern fra listen")}
    />
  );
}
