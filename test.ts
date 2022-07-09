// Constants and enums
enum Modes {
    Interactive,
    Timeout
}

// Classes and interfaces

// Global variables
let ledX: number = 2
let ledY: number = 2
let mode: Modes = Modes.Interactive
let timerId: number = -1

// Functions

/**
 * Disables interactive mode and tests the timeout functions.
 * Returns to interactive mode after approximately 30 seconds.
 */
function beginTimeoutTest(): void {
    mode = Modes.Timeout

    timer.after(500, printTime)
    timer.debounce("X", 5000, printTime)

    timerId = timer.setInterval(printTime, 5000)
    basic.showNumber(timerId)
    basic.clearScreen()
    basic.showNumber(timer.setTimeout(printTime, 500))
    basic.clearScreen()
    basic.showNumber(timer.setTimeout(endTimeoutTest, 30000))
}

function endTimeoutTest(): void {
    timer.clearTimeout(timerId)
    basic.showString("Done!")
    mode = Modes.Interactive
    lightLed()
}

function lightLed() {
    led.plot(ledX, ledY)
}

function moveDown() {
    moveLed(0, 1)
}

function moveLed(deltaX: number, deltaY: number) {
    unlightLed()
    ledX += deltaX
    ledY += deltaY
    while (ledX < 0) {
        ledX += 5
    }
    while (ledX > 4) {
        ledX += -5
    }
    while (ledY < 0) {
        ledY += 5
    }
    while (ledY > 4) {
        ledY += -5
    }
    lightLed()
}

function moveLeft() {
    moveLed(-1, 0)
}

function moveRight() {
    moveLed(1, 0)
}

function moveUp() {
    moveLed(0, -1)
}

function printTime(): void {
    basic.showNumber(control.millis())
}

function unlightLed() {
    led.unplot(ledX, ledY)
}

// Inputs
input.onButtonPressed(Button.A, function () {
    if (mode == Modes.Interactive) {
        timer.after(500, function () {
            moveLeft()
        })
    }
})

input.onButtonPressed(Button.B, function () {
    if (mode == Modes.Interactive) {
        timer.debounce("B press", 500, function () {
            moveRight()
        })
    }
})

input.onPinPressed(TouchPin.P0, function() {
    if (mode == Modes.Interactive) {
        beginTimeoutTest()
    }
})

input.onPinPressed(TouchPin.P1, function () {
    if (mode == Modes.Interactive) {
        timer.background(function () {
            moveUp()
        })
    }
})

input.onPinPressed(TouchPin.P2, function () {
    if (mode == Modes.Interactive) {
        timer.throttle("action", 500, function () {
            moveDown()
        })
    }
})

// Main
lightLed()