import Error "mo:base/Error";

import Float "mo:base/Float";
import Text "mo:base/Text";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Float {
    switch (operation) {
      case ("add") { num1 + num2 };
      case ("subtract") { num1 - num2 };
      case ("multiply") { num1 * num2 };
      case ("divide") {
        if (num2 == 0) {
          throw Error.reject("Division by zero");
        };
        num1 / num2
      };
      case (_) { throw Error.reject("Invalid operation") };
    }
  };
}
