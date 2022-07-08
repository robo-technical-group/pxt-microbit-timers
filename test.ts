function printTime(): void {
    basic.showNumber(control.millis())
}
timer.after(500, printTime)
timer.debounce("X", 5000, printTime)

/* Internal tests */
let tid: number = timer.setInterval(function () { basic.showNumber(control.millis()) }, 5000)
basic.showNumber(tid)
basic.clearScreen()
basic.showNumber(timer.setTimeout(function () { basic.showNumber(control.millis()) }, 500))
basic.clearScreen()
basic.showNumber(timer.setTimeout(function () { timer.clearInterval(tid) }, 30000))
