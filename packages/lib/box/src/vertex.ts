/**
 * Core interfaces describing vertices within a box graph.
 */
import {DataInput, DataOutput, Nullish, Option} from "@opendaw/lib-std"
import {Addressable} from "./address"
import {Box} from "./box"
import {Field, Fields} from "./field"
import {PointerField, PointerTypes} from "./pointer"
import {PointerHub} from "./pointer-hub"
import {PrimitiveField} from "./primitive"
import {ArrayField} from "./array"
import {BoxGraph} from "./graph"
import {ObjectField} from "./object"

/** Rules governing which pointer types may target a vertex. */
export interface PointerRules<P extends PointerTypes> {
    readonly accepts: ReadonlyArray<P>
    readonly mandatory: boolean
}

/** Convenience rule indicating that no pointers are accepted. */
export const NoPointers: PointerRules<never> = Object.freeze({mandatory: false, accepts: []})

/** Visitor interface for traversing vertex structures. */
export interface VertexVisitor<RETURN = void> {
    visitArrayField?(field: ArrayField): RETURN
    visitObjectField?<FIELDS extends Fields>(field: ObjectField<FIELDS>): RETURN
    visitPointerField?(field: PointerField): RETURN
    visitPrimitiveField?(field: PrimitiveField): RETURN
    visitField?(field: Field): RETURN
}

/** Type implemented by structures that can accept a vertex visitor. */
export interface Visitable {
    accept<VISITOR extends VertexVisitor<any>>(visitor: VISITOR): VISITOR extends VertexVisitor<infer R> ? Nullish<R> : void
}

/** Common interface for all vertices participating in a {@link BoxGraph}. */
export interface Vertex<P extends PointerTypes = PointerTypes, F extends Fields = any> extends Addressable, Visitable {
    get box(): Box
    get graph(): BoxGraph
    get parent(): Vertex
    get pointerHub(): PointerHub
    get pointerRules(): PointerRules<P>

    isBox(): this is Box
    isField(): this is Field
    isAttached(): boolean
    fields(): Iterable<Field>
    getField(key: keyof F): F[keyof F]
    optField(key: keyof F): Option<F[keyof F]>
    read(input: DataInput): void
    write(output: DataOutput): void
}