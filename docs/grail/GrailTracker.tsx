import { grailProgress } from "../../scripts/grail/list/grailProgress";
import { useContext, useMemo } from "preact/hooks";
import { JSX } from "preact";
import "./GrailTracker.css";
import { StashContext } from "../store/stashContext";
import { GrailSummary } from "./GrailSummary";

const TIER_NAMES = ["Normal", "Exceptional", "Elite"];

const toClassName = (b: boolean) => (b ? "found" : "missing");

export function GrailTracker() {
  const { stash } = useContext(StashContext);

  const progress = useMemo(() => stash && grailProgress(stash), [stash]);

  if (!progress) {
    return null;
  }

  const sections: JSX.Element[] = [];
  for (const [section, tiers] of progress) {
    tiers.forEach((tier, i) => {
      const items = [];
      for (const { item, normal, ethereal, perfect } of tier) {
        items.push(
          <tr>
            <th scope="row" class={"set" in item ? "set" : "unique"}>
              {item.name}
            </th>
            <td class={toClassName(normal)}>Normal</td>
            {typeof ethereal === "undefined" ? (
              <td>
                <span aria-label="Not applicable" />
              </td>
            ) : (
              <td class={toClassName(ethereal)}>Ethereal</td>
            )}
            <td class={toClassName(perfect)}>Perfect</td>
          </tr>
        );
      }
      const sectionName =
        tiers.length > 1 ? `${TIER_NAMES[i]} ${section.name}` : section.name;
      sections.push(
        <tbody>
          <tr>
            <td colSpan={4}>{sectionName}</td>
          </tr>
          {items}
        </tbody>
      );
    });
  }

  return (
    <>
      <div class="controls">
        <GrailSummary />
      </div>
      <table id="grail-tracker">{sections}</table>
    </>
  );
}
