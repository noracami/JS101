import "./style.css"
import javascriptLogo from "./javascript.svg"
import { setupCounter } from "./counter.js"

// 程式碼寫這裡
import Decimal from "decimal.js"

const memory = {
  before: "0",
  operator: "",
  after: "0",
  display: "0",
  state: 0,
}

const setMemory = ({ before, operator, after, display, state }) => {
  if (before !== undefined) memory.before = before
  if (operator !== undefined) memory.operator = operator
  if (after !== undefined) memory.after = after
  if (display !== undefined) memory.display = display
  if (state !== undefined) memory.state = state
}

const getMemory = () => {
  return memory
}

const allClear = () => {
  setMemory({ before: "0", operator: "", after: "0", display: "0", state: 0 })
  updateDisplay()
}

const updateDisplay = () => {
  const domDisplay = document.querySelector(".display")

  domDisplay.textContent = new Decimal(memory.display)
}

const addDecimalPoint = () => {
  console.log(".")
}
const numeric = (n) => {
  switch (memory.state) {
    // start
    case 0:
      if (n !== "0") {
        setMemory({ display: n, state: 1 })
        updateDisplay()
      }
      break

    // display has value, no operator
    case 1: {
      if (memory.display.length < 10) {
        const { display } = getMemory()
        setMemory({ display: display + n })
        updateDisplay()
      }
      break
    }

    // display has value, first input after operator
    // keep num in before
    case 2: {
      setMemory({ display: n, state: 3 })
      updateDisplay()
      break
    }

    // display has value, has operator
    case 3: {
      if (memory.display.length < 10) {
        const { display } = getMemory()
        setMemory({ display: display + n })
        updateDisplay()
      }
      break
    }

    // after calculate result, press num > flush the display
    // keep last operator in memory
    case 4: {
      setMemory({ display: n, state: 5 })
      break
    }

    // keep last operator in memory
    case 5: {
      if (memory.display.length < 10) {
        const { display } = getMemory()
        setMemory({ display: display + n })
      }
      break
    }

    default:
      break
  }
}

const plus = (operator) => {
  switch (memory.state) {
    case 0:
    case 1: {
      const { display } = getMemory()
      setMemory({ operator, before: display, state: 2 })
      break
    }

    case 2:
      setMemory({ operator })
      break

    case 3: {
      // calculate answer
      const { before, display } = getMemory()
      const result = new Decimal(before).plus(display)
      setMemory({ before: result, display: result, state: 2 })
      updateDisplay()
      break
    }

    case 4: {
      // after calculate result, press + >
      // keep current num in memory
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    case 5: {
      ///
      // calculate answer
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}
const minus = (operator) => {
  switch (memory.state) {
    case 0:
    case 1: {
      const { display } = getMemory()
      setMemory({ operator, before: display, state: 2 })
      break
    }

    case 2: {
      setMemory({ operator })
      break
    }

    case 3: {
      const { before, display } = getMemory()
      const result = new Decimal(before).minus(display)
      setMemory({ before: result, display: result, state: 2 })
      updateDisplay()
      break
    }

    case 4: {
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    case 5: {
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}
// TODO operator precedence
const multiply = (operator) => {
  switch (memory.state) {
    case 0:
    case 1: {
      const { display } = getMemory()
      setMemory({ operator, before: display, state: 2 })
      break
    }

    case 2: {
      setMemory({ operator })
      break
    }

    case 3: {
      const { before, display } = getMemory()
      const result = new Decimal(before).mul(display)
      setMemory({ before: result, display: result, state: 2 })
      updateDisplay()
      break
    }

    case 4: {
      // after calculate result, press x >
      // keep current num in memory
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    case 5: {
      const { display } = getMemory()
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}
const divide = () => {
  console.log("divide()")
}
const changeSign = () => {
  console.log("changeSign")
}
const percentage = () => {
  console.log("turn into %")
}
const calculate = () => {
  const { display, before, operator, state } = getMemory()
  switch (operator) {
    case "+": {
      setMemory({
        display: new Decimal(before).plus(display),
        state: 4,
      })
      if (state === 3) {
        setMemory({ before: display })
      }
      updateDisplay()
      break
    }

    case "–": {
      setMemory({
        display: new Decimal(display).minus(before),
        state: 4,
      })
      if (state === 2) {
        setMemory({ display: "0", before: display })
      }
      if (state === 3) {
        setMemory({
          display: new Decimal(before).minus(display),
          before: display,
        })
      }
      updateDisplay()
      break
    }

    case "×": {
      setMemory({
        display: new Decimal(before).mul(display),
        state: 4,
      })
      if (state === 3) {
        setMemory({ before: display })
      }
      updateDisplay()
      break
    }
    // TODO
    case "÷": {
      break
    }

    default:
      break
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const calc = document.querySelector(".calc")
  calc.addEventListener("mousedown", (e) => {
    const VALUE = e.target.textContent
    if (e.target.className === "display") {
      console.log("It's Display!!")
    } else {
      switch (VALUE) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          numeric(VALUE)
          break

        case "+":
          plus(VALUE)
          break
        case "–":
          minus(VALUE)
          break
        case "×":
          multiply(VALUE)
          break
        case "÷":
          divide()
          break

        case ".":
          addDecimalPoint()
          break

        case "+/-":
          changeSign()
          break
        case "%":
          percentage()
          break
        case "AC":
          allClear()
          console.log("AC")
          break
        case "=":
          calculate()
          break

        default:
          console.log(e.target.className)

          break
      }
    }
    console.log(getMemory())
  })
  console.log(getMemory())
})
