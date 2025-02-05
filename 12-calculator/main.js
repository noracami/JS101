import "./style.css"

// 程式碼寫這裡
import Decimal from "decimal.js"

const memory = {
  before: "0",
  decimalPoint: false,
  display: "0",
  operator: "",
  state: 0,
}

const setMemory = ({ before, decimalPoint, display, operator, state }) => {
  if (before !== undefined) memory.before = before
  if (decimalPoint !== undefined) memory.decimalPoint = decimalPoint
  if (display !== undefined) memory.display = display
  if (operator !== undefined) memory.operator = operator
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
  // TODO fixed the display length
  domDisplay.textContent = memory.display
}

const addDecimalPoint = () => {
  const { display, state, decimalPoint } = getMemory()
  if (!decimalPoint && new Decimal(display).isInteger()) {
    switch (state) {
      case 0:
      case 2:
      case 4: {
        setMemory({
          display: "0.",
          decimalPoint: true,
          state: state + 1,
        })
        break
      }
      case 1:
      case 3:
      case 5: {
        setMemory({
          display: `${display}.`,
          decimalPoint: true,
        })
        break
      }

      default:
        break
    }
    updateDisplay()
  }
}

const numeric = (n) => {
  const { display, state, decimalPoint } = getMemory()
  switch (state) {
    case 0:
      if (n !== "0") {
        setMemory({ display: n, state: 1 })
      }
      break
    case 1:
    case 3:
    case 5: {
      if (display.length < 10 || (decimalPoint && display.length < 12)) {
        setMemory({ display: display + n })
      }
      break
    }
    case 2:
    case 4: {
      setMemory({ display: n, state: state + 1 })
      break
    }
    case 6: {
      allClear()
      setMemory({
        display: n,
        state: n === "0" ? 0 : 1,
      })
      break
    }

    default:
      break
  }
  updateDisplay()
}

const plus = (operator) => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0:
    case 1:
    case 4: {
      // after calculate result, press + >
      // keep current num in memory
      setMemory({
        operator,
        before: new Decimal(display),
        state: 2,
      })
      if (decimalPoint) {
        setMemory({ decimalPoint: false })
      }
      break
    }
    case 2:
      setMemory({ operator })
      break
    case 3: {
      calculate()
      setMemory({ before: display, operator, state: 2 })
      break
    }
    case 5: {
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}

const minus = (operator) => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0:
    case 1:
    case 4: {
      setMemory({
        operator,
        before: new Decimal(display),
        state: 2,
      })
      if (decimalPoint) {
        setMemory({ decimalPoint: false })
      }
      break
    }
    case 2: {
      setMemory({ operator })
      break
    }
    case 3: {
      calculate()
      setMemory({ before: display, operator, state: 2 })
      break
    }
    case 5: {
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}

// TODO operator precedence
const multiply = (operator) => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0:
    case 1:
    case 4: {
      setMemory({
        operator,
        before: new Decimal(display),
        state: 2,
      })
      if (decimalPoint) {
        setMemory({ decimalPoint: false })
      }
      break
    }
    case 2: {
      setMemory({ operator })
      break
    }
    case 3: {
      calculate()
      setMemory({ before: display, operator, state: 2 })
      break
    }
    case 5: {
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}

const divide = (operator) => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0:
    case 1:
    case 4: {
      setMemory({
        operator,
        before: new Decimal(display),
        state: 2,
      })
      if (decimalPoint) {
        setMemory({ decimalPoint: false })
      }
      break
    }
    case 2: {
      setMemory({ operator })
      break
    }
    case 3: {
      calculate()
      setMemory({ before: display, operator, state: 2 })
      break
    }
    case 5: {
      setMemory({ before: display, operator, state: 2 })
      break
    }

    default:
      break
  }
}

const changeSign = () => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0: {
      setMemory({
        display: new Decimal(display).negated(),
      })
      break
    }

    case 1: {
      setMemory({
        display: new Decimal(display).negated(),
        state: 0,
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    case 2: {
      setMemory({
        display: new Decimal(display).negated(),
      })
      break
    }

    case 3: {
      setMemory({
        display: new Decimal(display).negated(),
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    case 4: {
      setMemory({
        display: new Decimal(display).negated(),
      })
      break
    }

    case 5: {
      setMemory({
        display: new Decimal(display).negated(),
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    default:
      break
  }
  updateDisplay()
}

// FIXME result is weird in real calculator e.g. input is ['2', '+', '%']
//       expect is 0.02, but it shows 0.04
const percentage = () => {
  const { display, decimalPoint, state } = getMemory()
  switch (state) {
    case 0: {
      setMemory({
        display: new Decimal(display).div(100),
      })
      break
    }

    case 1: {
      setMemory({
        display: new Decimal(display).div(100),
        state: 0,
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    case 2: {
      setMemory({
        display: new Decimal(display).div(100),
      })
      break
    }

    case 3: {
      setMemory({
        display: new Decimal(display).div(100),
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    case 4: {
      setMemory({
        display: new Decimal(display).div(100),
      })
      break
    }

    case 5: {
      setMemory({
        display: new Decimal(display).div(100),
      })
      decimalPoint && setMemory({ decimalPoint: false })
      break
    }

    default:
      break
  }
  updateDisplay()
}

const calculate = () => {
  const { display, before, operator, decimalPoint, state } = getMemory()
  switch (operator) {
    case "+": {
      setMemory({
        display: new Decimal(before).plus(display),
        state: 4,
      })
      if (state === 3) {
        decimalPoint
          ? setMemory({ before: new Decimal(display) })
          : setMemory({ before: display })
      }
      decimalPoint && setMemory({ decimalPoint: false })
      updateDisplay()
      break
    }

    case "–": {
      setMemory({
        display: new Decimal(display).minus(before),
        state: 4,
      })
      if (state === 2 || state === 3) {
        if (state === 3) {
          setMemory({ display: new Decimal(before).minus(display) })
        }
        decimalPoint
          ? setMemory({ before: new Decimal(display) })
          : setMemory({ before: display })
      }
      decimalPoint && setMemory({ decimalPoint: false })
      updateDisplay()
      break
    }

    case "×": {
      setMemory({
        display: new Decimal(before).mul(display),
        state: 4,
      })
      if (state === 3) {
        decimalPoint
          ? setMemory({ before: new Decimal(display) })
          : setMemory({ before: display })
      }
      decimalPoint && setMemory({ decimalPoint: false })
      updateDisplay()
      break
    }

    case "÷": {
      if (display === "0") {
        setMemory({
          display: "不是數字",
          state: 6,
        })
        updateDisplay()
      } else {
        setMemory({
          display: new Decimal(display).div(before),
          state: 4,
        })
        if (state === 2 || state === 3) {
          if (state === 3) {
            setMemory({ display: new Decimal(before).div(display) })
          }
          decimalPoint
            ? setMemory({ before: new Decimal(display) })
            : setMemory({ before: display })
        }
        decimalPoint && setMemory({ decimalPoint: false })
        updateDisplay()
        break
      }
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
          divide(VALUE)
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
