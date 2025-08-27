import {Xml} from "./index"

/** Common fields shared by all book types. */
export abstract class BookSchema {
    /** Title of the book. */
    @Xml.Attribute("title", Xml.StringRequired)
    readonly title!: string

    /** Author of the book. */
    @Xml.Attribute("author", Xml.StringRequired)
    readonly author!: string
}

@Xml.Class("Shelf")
/** A shelf within a library section. */
export class ShelfSchema {
    /** Unique identifier for the shelf. */
    @Xml.Attribute("id", Xml.StringRequired)
    readonly id!: string

    /** Collection of books placed on this shelf. */
    @Xml.ElementRef(BookSchema)
    readonly books?: BookSchema[]
}

@Xml.Class("Review")
/** Optional review attached to a book. */
export class ReviewSchema {
    /** Numerical score given in the review. */
    @Xml.Attribute("score", Xml.NumberRequired)
    readonly score!: number

    /** Free‑form review text. */
    @Xml.Element("text", String)
    readonly text?: string
}

@Xml.Class("Novel")
/** Fictional book with optional review. */
export class NovelSchema extends BookSchema {
    /** Page count of the novel. */
    @Xml.Attribute("pages", Xml.NumberOptional)
    readonly pages?: number

    /** Optional review information. */
    @Xml.Element("Review", ReviewSchema)
    readonly review?: ReviewSchema
}

@Xml.Class("Comic")
/** Comic book including illustrator info. */
export class ComicSchema extends BookSchema {
    /** Name of the illustrator. */
    @Xml.Attribute("illustrator", Xml.StringOptional)
    readonly illustrator?: string

    /** Optional review information. */
    @Xml.Element("Review", ReviewSchema)
    readonly review?: ReviewSchema
}

@Xml.Class("Textbook")
/** Educational textbook. */
export class TextbookSchema extends BookSchema {
    /** Edition number, if provided. */
    @Xml.Attribute("edition", Xml.NumberOptional)
    readonly edition?: number
}

@Xml.Class("Section")
/** A section of the library containing shelves. */
export class SectionSchema {
    /** Unique section identifier. */
    @Xml.Attribute("id", Xml.StringRequired)
    readonly id!: string

    /** Display name of the section. */
    @Xml.Attribute("name", Xml.StringRequired)
    readonly name!: string

    /** Shelves present in this section. */
    @Xml.ElementRef(ShelfSchema)
    readonly shelves!: ShelfSchema[]
}

@Xml.Class("Library")
/** Root schema describing the library. */
export class LibrarySchema {
    /** Name of the library. */
    @Xml.Attribute("name", Xml.StringRequired)
    readonly name!: string

    /** Physical location of the library. */
    @Xml.Attribute("location", Xml.StringOptional)
    readonly location?: string

    /** Library sections grouped under a wrapper element. */
    @Xml.ElementRef(SectionSchema, "Sections")
    readonly sections!: SectionSchema[]
}