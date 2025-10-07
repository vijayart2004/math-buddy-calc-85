import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performOperation(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performOperation = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = performOperation(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleDelete = () => {
    if (!waitingForOperand) {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumber(e.key);
      } else if (e.key === ".") {
        handleDecimal();
      } else if (e.key === "+" || e.key === "-") {
        handleOperation(e.key);
      } else if (e.key === "*") {
        handleOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        handleOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Escape") {
        handleClear();
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  const CalcButton = ({ 
    children, 
    onClick, 
    variant = "number" 
  }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    variant?: "number" | "operator" | "equals" | "clear" 
  }) => {
    const baseClasses = "h-16 text-xl font-semibold calc-button-scale shadow-sm hover:shadow-md";
    const variantClasses = {
      number: "bg-[hsl(var(--button-number))] hover:bg-[hsl(var(--button-number-hover))] text-foreground",
      operator: "bg-[hsl(var(--button-operator))] hover:bg-[hsl(var(--button-operator-hover))] text-[hsl(var(--button-operator-foreground))]",
      equals: "bg-[hsl(var(--button-equals))] hover:bg-[hsl(var(--button-equals-hover))] text-primary-foreground",
      clear: "bg-[hsl(var(--button-clear))] hover:bg-[hsl(var(--button-clear-hover))] text-destructive-foreground"
    };

    return (
      <Button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm p-6 bg-[hsl(var(--calculator-bg))] shadow-2xl shadow-[hsl(var(--calculator-shadow))]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            ✨ Math Buddy ✨
          </h1>
          <p className="text-sm text-muted-foreground">Your friendly calculator 💖</p>
        </div>

        <div className="mb-6 p-6 bg-[hsl(var(--display-bg))] rounded-xl">
          <div className="text-right text-4xl font-bold text-foreground break-all">
            {display}
          </div>
          {operation && (
            <div className="text-right text-sm text-muted-foreground mt-2">
              {previousValue} {operation}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          <CalcButton onClick={handleClear} variant="clear">
            AC
          </CalcButton>
          <CalcButton onClick={handleDelete} variant="clear">
            DEL
          </CalcButton>
          <CalcButton onClick={() => handleOperation("÷")} variant="operator">
            ÷
          </CalcButton>
          <CalcButton onClick={() => handleOperation("×")} variant="operator">
            ×
          </CalcButton>

          <CalcButton onClick={() => handleNumber("7")}>7</CalcButton>
          <CalcButton onClick={() => handleNumber("8")}>8</CalcButton>
          <CalcButton onClick={() => handleNumber("9")}>9</CalcButton>
          <CalcButton onClick={() => handleOperation("-")} variant="operator">
            −
          </CalcButton>

          <CalcButton onClick={() => handleNumber("4")}>4</CalcButton>
          <CalcButton onClick={() => handleNumber("5")}>5</CalcButton>
          <CalcButton onClick={() => handleNumber("6")}>6</CalcButton>
          <CalcButton onClick={() => handleOperation("+")} variant="operator">
            +
          </CalcButton>

          <CalcButton onClick={() => handleNumber("1")}>1</CalcButton>
          <CalcButton onClick={() => handleNumber("2")}>2</CalcButton>
          <CalcButton onClick={() => handleNumber("3")}>3</CalcButton>
          <CalcButton onClick={handleEquals} variant="equals">
            =
          </CalcButton>

          <CalcButton onClick={() => handleNumber("0")} >
            0
          </CalcButton>
          <CalcButton onClick={handleDecimal}>.</CalcButton>
          <div className="col-span-2"></div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Tip: You can use your keyboard! ⌨️
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
