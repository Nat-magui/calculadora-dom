// Buscamos en el HTML el elemento que funciona como pantalla de la calculadora
const display = document.querySelector(".calculator-display")

// Buscamos el contenedor donde JavaScript va a crear e insertar los botones
const keypad = document.querySelector(".calculator-keypad")

// Validamos que el display exista antes de seguir ejecutando el código
if (!display) {
    throw new Error("No se encontró el display de la calculadora")
}

// Validamos que el teclado exista antes de seguir ejecutando el código
if (!keypad) {
    throw new Error("No se encontró el teclado de la calculadora")
}

// Creamos el estado de la calculadora, es decir, su "memoria interna"
const calculatorState = {
    // Guarda el número que se está escribiendo actualmente
    currentValue: "0",

    // Guarda el número anterior cuando se elige una operación
    previousValue: null,

    // Guarda el operador seleccionado: +, -, * o /
    operator: null
}

// Creamos el array de botones
// label = texto que se muestra en el botón
// type = tipo de botón, usado después para decidir qué acción ejecutar
const buttons = [
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "/", type: "operator" },

    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "*", type: "operator" },

    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "-", type: "operator" },

    { label: "0", type: "number" },
    { label: ".", type: "decimal" },
    { label: "←", type: "delete" },
    { label: "C", type: "clear" },
    { label: "=", type: "equals" },
    { label: "+", type: "operator" }

]

// Esta función actualiza la pantalla con el valor guardado en calculatorState.currentValue
function renderDisplay() {
    display.textContent = calculatorState.currentValue
}

// Esta función maneja los botones numéricos
function handleNumber(value) {
    // Si el valor actual es "0", reemplazamos ese cero por el número presionado
    // Actualizamos para que no quede "ERROR7" al ingresar un numero
    if (calculatorState.currentValue === "0" || calculatorState.currentValue === "Error") {
        calculatorState.currentValue = value
        return
    }

    // Si ya hay un número escrito, concatenamos el nuevo dígito al final
    calculatorState.currentValue += value
}

//esta funcion agrega un punto decimal al numero actual
function handleDecimal(){
    //si el display muestra error, empezamos un numero numero decimal desde 0
    if (calculatorState.currentValue === "Error"){
        calculatorState.currentValue = "0."
        return
    }
    //si el numero ya tiene punto no dejamos que se agregue otro
    if(calculatorState.currentValue.includes(".")){
        return
    }
    //si no tiene punto, agregamos el decinal al final
    calculatorState.currentValue += "."
}

// Esta función limpia la calculadora y vuelve todo al estado inicial
function clearCalculator() {
    calculatorState.currentValue = "0"
    calculatorState.previousValue = null
    calculatorState.operator = null
}

//esta funcion borrara el ultimo digito del valor actual tipiado
function deleteLastDigit(){
    //si el display muestra error entonces volvemos a 0 directamente
    if (calculatorState.currentValue === "Error"){
        calculatorState.currentValue = "0"
        return
    }

    //si queda un solo digito volvemos a cer
    if(calculatorState.currentValue.length === 1){
        calculatorState.currentValue = "0"
        return
    }

    //si hay mas de un digito, quitamos el ultimo caracter
    calculatorState.currentValue = calculatorState.currentValue.slice(0,-1)

}

// Esta función maneja los operadores matemáticos
function handleOperator(operator) {
    // Guardamos el número actual como valor previo
    calculatorState.previousValue = calculatorState.currentValue

    // Guardamos el operador seleccionado
    calculatorState.operator = operator

    // Reiniciamos el valor actual para que el usuario escriba el segundo número
    calculatorState.currentValue = "0"
}

// Esta función calcula el resultado final
function calculateResult() {
    // Primero validamos que exista un número previo y un operador
    // Si falta alguno de los dos, no hay nada para calcular
    if (calculatorState.previousValue === null || calculatorState.operator === null) {
        return
    }

    // Convertimos los valores guardados como texto a números para poder operar
    const previous = Number(calculatorState.previousValue)
    const current = Number(calculatorState.currentValue)
    let result = 0

    // Calculamos según el operador seleccionado
    if (calculatorState.operator === "+") {
        result = previous + current
    }

    if (calculatorState.operator === "-") {
        result = previous - current
    }

    if (calculatorState.operator === "*") {
        result = previous * current
    }

    if (calculatorState.operator === "/") {
        //evitamos dvidir por cero prque no es una operacion valida
        if (current === 0) {
            calculatorState.currentValue = "Error"
            calculatorState.previousValue = null
            calculatorState.operator = null
            return
        }

        result = previous / current
    }

    // Guardamos el resultado como texto para mostrarlo en el display
    calculatorState.currentValue = String(result)

    // Limpiamos el valor previo y el operador porque la operación ya terminó
    calculatorState.previousValue = null
    calculatorState.operator = null
}

// Creamos una función para generar botones desde JavaScript
function createButton() {
    const button = document.createElement("button")
    return button
}

// Recorremos el array de botones y creamos un botón HTML por cada objeto
buttons.forEach(function (buttonConfig) {
    // Creamos un botón nuevo
    const button = createButton()

    // Mostramos en el botón el texto definido en label
    button.textContent = buttonConfig.label

    // Guardamos información extra en el HTML para usarla cuando el usuario haga click
    button.dataset.type = buttonConfig.type
    button.dataset.value = buttonConfig.label

    // Agregamos la clase base para aplicar estilos desde CSS
    button.classList.add("calculator-button")

    // Si el botón es un operador, agregamos una clase extra para diferenciarlo visualmente
    if (buttonConfig.type === "operator") {
        button.classList.add("operator")
    }

    // Insertamos el botón dentro del teclado de la calculadora
    keypad.append(button)
})

// Esta función se ejecuta cada vez que el usuario hace click en el teclado
function buttonPress(event) {
    // Buscamos el botón más cercano al lugar donde ocurrió el click
    const button = event.target.closest("button")

    // Si el click no ocurrió sobre un botón, salimos de la función
    if (!button) {
        return
    }

    // Leemos la información guardada en dataset
    const type = button.dataset.type
    const value = button.dataset.value

    // Según el tipo de botón, ejecutamos una función distinta
    if (type === "number") {
        handleNumber(value)
    }

    if (type === "operator") {
        handleOperator(value)
    }

    if (type === "clear") {
        clearCalculator()
    }

    if (type === "equals") {
        calculateResult()
    }

    if (type === "delete"){
        deleteLastDigit()
    }

    if (type === "decimal"){
        handleDecimal()
    }

    // Después de cada acción, actualizamos la pantalla
    renderDisplay()
}

// Escuchamos los clicks en todo el teclado de la calculadora
keypad.addEventListener("click", buttonPress)