/* Internal tests
let tid: number = setInterval(function () { basic.showNumber(control.millis()) }, 5000)
basic.showNumber(tid)
basic.clearScreen()
basic.showNumber(setTimeout(function () { basic.showNumber(control.millis()) }, 500))
basic.clearScreen()
basic.showNumber(setTimeout(function () { clearInterval(tid) }, 30000))
*/

function printTime(): void {
    basic.showNumber(control.millis())
}
timer.after(500, printTime)
timer.debounce("X", 5000, printTime)
