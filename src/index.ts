/**
 * Execute a callback function after the `DOMContentLoaded` event was fired, or
 * execute immediately if the event already fired.
 * 
 * @since 0.0.1
 * 
 * @param callback A function that will be executed.
 * 
 * @example
 * onDomReady(() => { console.log("The DOM was loaded."); });
 */
export function onDomReady(callback: OnDomReadyCallback): void
{
    if (process.env.NODE_ENV !== "production")
    {
        if (typeof callback !== "function")
        {
            throw new TypeError("`callback` is not a function.");
        }
    }

    const readyState = document.readyState;
    if ((readyState === "interactive") || (readyState === "complete"))
    {
        callback();
    }
    else
    {
        document.addEventListener("DOMContentLoaded", () => { callback(); });
    }
}

/**
 * A callback function that will be executed by `onDomReady()`.
 * 
 * @since 0.0.1
 */
export type OnDomReadyCallback = () => void;

export default onDomReady;
