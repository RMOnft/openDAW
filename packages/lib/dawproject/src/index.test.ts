/* eslint-disable */
/**
 * Exercises the DAWproject XML utilities by round-tripping fragments and
 * parsing a full project example.
 */
import { describe, expect, it } from "vitest";
import { asInstanceOf } from "@opendaw/lib-std";
import { Xml } from "@opendaw/lib-xml";
import { MetaDataSchema, ProjectSchema, TrackSchema } from "./";
import exampleXml from "@test-files/bitwig.example.xml?raw";

describe("DAW-project XML", () => {
  it("encodes and parses MetaData", () => {
    // Encode a MetaData element and parse it back into a class instance
    const title = "This is the title.";
    const artist = "André Michelle";
    const website = "https://opendaw.studio";
    const xmlString = Xml.pretty(
      Xml.toElement(
        "MetaData",
        Xml.element({ title, artist, website }, MetaDataSchema),
      ),
    );
    const metaDataSchema = Xml.parse(xmlString, MetaDataSchema);
    expect(metaDataSchema.title).toBe(title);
    expect(metaDataSchema.artist).toBe(artist);
    expect(metaDataSchema.website).toBe(website);
    expect(metaDataSchema.comment).toBe(undefined);
  });

  it("parses an example project", () => {
    // Parse a provided DAWproject file and inspect its structure
    const result: ProjectSchema = Xml.parse(exampleXml, ProjectSchema);
    expect(
      asInstanceOf(result.structure[0], TrackSchema).channel?.audioChannels,
    ).toBe(2);
    expect(asInstanceOf(result.structure[1], TrackSchema).channel?.id).toBe(
      "id10",
    );
  });
});
