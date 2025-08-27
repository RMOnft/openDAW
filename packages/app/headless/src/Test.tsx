import {createElement} from "@opendaw/lib-jsx"

/** Props for the {@link Test} component. */
type Construct = {}

/**
 * A tiny component used to verify JSX transpilation in the headless setup.
 */
export const Test = ({}: Construct) => {
    return (
        <div>Hello Jsx</div>
    )
}

