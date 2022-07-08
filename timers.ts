/*
From MakeCode Arcade IntelliSense:
setTimeout(func: () => void, delay: number): number

From MDN
https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
setTimeout(code)
setTimeout(code, delay)

setTimeout(functionRef)
setTimeout(functionRef, delay)
setTimeout(functionRef, delay, param1)
setTimeout(functionRef, delay, param1, param2)
setTimeout(functionRef, delay, param1, param2, ... , paramN)

Return value
The returned timeoutID is a positive integer value which identifies
the timer created by the call to setTimeout().
This value can be passed to clearTimeout() to cancel the timeout.

It is guaranteed that a timeoutID value will never be reused by
a subsequent call to setTimeout() or setInterval() on the same object
(a window or a worker).
However, different objects use separate pools of IDs.
*/

// Run any outstanding timers each update cycle.
basic.forever(timer.runTimers)

//% color=#700204 icon="\uf254"
//% groups='[]'
namespace timer {
    interface timerInfo {
        fn: () => void,
        delay: number,
        loop: boolean,
        nextRun: number
    }

    let timers: timerInfo[] = []

    // Support functions
    function clearInterval(timeoutID: number): void {
        clearTimeout(timeoutID)
    }

    function clearTimeout(timeoutID: number): void {
        if (timers.length > timeoutID) {
            timers[timeoutID].nextRun = -1
        }
    }

    export function runTimers(): void {
        for (let t of timers.filter(function (value: timerInfo, index: number): boolean {
            return value.nextRun > -1 && control.millis() >= value.nextRun
        })) {
            t.fn()
            t.nextRun = t.loop ?
                t.nextRun = control.millis() + t.delay :
                -1
        }
    }

    function setInterval(func: () => void, delay: number): number {
        let toReturn: number = setTimeout(func, delay)
        timers[toReturn].loop = true
        return toReturn
    }

    function setTimeout(func: () => void, delay: number): number {
        let toReturn: number = timers.length
        timers.push({
            fn: func,
            delay: delay,
            loop: false,
            nextRun: control.millis() + delay
        })
        return toReturn
    }

    /**
     * After a certain amount of time, the attached code will run.
     * Blocks after this one will run without waiting.
     */
    //% block="after $time do"
    //% time.defl=500
    //% handlerStatement=1
    //% %time=timePicker ms"
    export function after(time: number, thenDo: () => void) {
        setTimeout(thenDo, time)
    }

    /**
     * Run the attached code seperately from other code.
     * This creates a seperate context for "pause" so that pauses
     * within or without this code are seperated.
     */
    //% block="separately do"
    //% handlerStatement=1
    export function background(then: () => void) {
        control.runInBackground(then)
    }

    let debounceTimeouts: { [key: string]: number } = {}
    /**
     * After this block hasn't been called with the given key
     * for a certain amount of time run the attached code.
     * Also known as "debounce".
     */
    //% block="after $key settled for $time do"
    //% time.defl=500
    //% key.defl="action"
    //% handlerStatement=1
    //% %time=timePicker ms"
    export function debounce(key: string, time: number, thenDo: () => void) {
        if (debounceTimeouts[key]) {
            clearTimeout(debounceTimeouts[key])
        }
        debounceTimeouts[key] = setTimeout(thenDo, time)
    }

    let throttleTimeouts: { [key: string]: number } = {}
    /**
     * Ensure that the attached code isn't run more than
     * once per time interval for the given key.
     * Also known as "throttle".
     */
    //% block="for $key at most once every $time do"
    //% time.defl=500
    //% key.defl="action"
    //% handlerStatement=1
    //% %time=timePicker ms"
    export function throttle(key: string, time: number, thenDo: () => void) {
        if (!throttleTimeouts[key]) {
            thenDo();
            throttleTimeouts[key] = setTimeout(() => {
                throttleTimeouts[key] = null;
            }, time)
        }
    }
}
