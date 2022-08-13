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
  if (before ?? null) memory.before = before
  if (operator ?? null) memory.operator = operator
  if (after ?? null) memory.after = after
  if (display ?? null) memory.display = display
  if (state ?? null) memory.state = state
}

const getMemory = () => {
  return memory
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
        setMemory({ before: n, display: n, state: 1 })
        updateDisplay()
      }
      break

    // display has value, no operator
    case 1:
      if (memory.display.length < 10) {
        const { before, display } = getMemory()
        setMemory({ before: before + n, display: display + n })
        updateDisplay()
      }
      break

    // display has value, first input after operator
    case 2:
      const {} = getMemory()
      setMemory({ after: n, display: n, state: 3 })
      updateDisplay()
      break

    // display has value, has operator
    case 3:
      if (memory.display.length < 10) {
        const { after, display } = getMemory()
        setMemory({ after: after + n, display: display + n })
        updateDisplay()
      }
      break

    default:
      break
  }
}

const plus = (operator) => {
  switch (memory.state) {
    case 0:
    case 1: {
      const { before } = getMemory()
      setMemory({ operator, after: before, state: 2 })
      break
    }

    case 2:
      setMemory({ operator })
      break

    case 3: {
      // calculate answer
      const { before, after } = getMemory()
      const result = new Decimal(before).plus(after)
      setMemory({ before: result, display: result, state: 2 })
      updateDisplay()
      break
    }

    default:
      break
  }
}
const minus = () => {
  console.log("minus()")
}
const multiply = (num) => {
  console.log(`multiply(${num ?? ""})`)
}
const divide = () => {
  console.log("divide()")
}
const changeSign = () => {
  console.log("changeSign")
}
// TODO
const calculate = () => {
  const { before, after, operator } = getMemory()
  switch (operator) {
    case "+": {
      const result = new Decimal(before).plus(after)
      setMemory({ before: result, display: result, state: 2 })
      updateDisplay()
      break
    }

    default:
      break
  }
}
const allClear = () => {
  setMemory({
    before: "0",
    operator: "",
    after: "0",
    display: "0",
    state: 0,
  })
  updateDisplay()
}

document.addEventListener("DOMContentLoaded", () => {
  const calc = document.querySelector(".calc")
  console.log(calc)
  calc.addEventListener("mousedown", (e) => {
    if (e.target.className === "display") {
      console.log("It's Display!!")
    } else {
      switch (e.target.textContent) {
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
          numeric(e.target.textContent)
          break

        case "+":
          plus(e.target.textContent)
          break
        case "–":
          minus()
          break
        case "×":
          multiply()
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
          multiply(100)
          break
        case "AC":
          allClear()
          break
        case "=":
          calculate()
          break

        default:
          console.log(e.target.className)

          break
      }
    }
    // if (e.target.className.includes("number-key")) {
    //   if (e.target.textContent === ".") {
    //     addDecimalPoint()
    //   } else {
    //     console.log(e.target.textContent)
    //   }
    // } else {
    //   console.log(e.target.className)
    //   console.log(e.target.textContent)
    // }
    // console.log(e.target.textContent)
  })
})
