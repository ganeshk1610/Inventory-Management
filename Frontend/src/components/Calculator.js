import React, { useState } from "react";
import Draggable from "react-draggable";
import "./Calculator.css";

const Calculator = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [result, setResult] = useState(""); // Display the ongoing equation
  const [isPercentage, setIsPercentage] = useState(false); // Flag to track if % is in use

  // Function to handle button click
  const handleButtonClick = (value) => {
    if (value === "C") {
      setResult(""); // Clear the input
      setIsPercentage(false); // Reset percentage flag
    } else if (value === "=") {
      try {
        // If the result contains % (e.g., 20%2)
        if (result.includes("%")) {
          const [left, right] = result.split("%");
          // Calculate percentage (left / 100) * right
          setResult((parseFloat(left) / 100) * parseFloat(right));
        } else {
          // Evaluate the expression normally
          setResult(eval(result).toString());
        }
      } catch {
        setResult("Error"); // In case of an error, show "Error"
      }
    } else {
      setResult(result + value); // Concatenate the value
      if (value === "%") {
        setIsPercentage(true); // Set flag when % is entered
      }
    }
  };

  // Handle percentage calculation: Convert current value into percentage of 100
  const handlePercentage = () => {
    // If percentage is pressed, just append % to the result
    if (!isPercentage) {
      setResult(result + "%");
      setIsPercentage(true); // Set flag when % is added
    }
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  return (
    <>
      <button onClick={toggleCalculator} className="calculator-button">
        🧮
      </button>

      {showCalculator && (
        <Draggable>
          <div className="calculator-container">
            <div className="calculator-header">
              <button onClick={toggleCalculator}>✖</button>
            </div>

            {/* Display the ongoing equation */}
            <input
              type="text"
              value={result}
              readOnly
              className="calculator-display"
            />

            <div className="calculator-buttons">
              {/* Numbers 1-9, 0, and other special buttons */}
              {[
                "7",
                "8",
                "9",
                "/",
                "4",
                "5",
                "6",
                "*",
                "1",
                "2",
                "3",
                "-",
                "C",
                "0",
                "=",
                "+",
                "%",
                "(",
                ")",
                ".",
              ].map((button) => (
                <button
                  key={button}
                  onClick={() =>
                    button === "%" ? handlePercentage() : handleButtonClick(button)
                  }
                  className={`calculator-button-item ${
                    button === "C"
                      ? "clear"
                      : button === "="
                      ? "equals"
                      : ["+", "-", "*", "/"].includes(button)
                      ? "operator"
                      : button === "%"
                      ? "percent"
                      : ["(", ")"].includes(button)
                      ? "parentheses"
                      : button === "."
                      ? "decimal"
                      : ""
                  }`}
                >
                  {button}
                </button>
              ))}
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default Calculator;
