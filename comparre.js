const obj1 = [{ id: 2, name: "Salim", age: 25 }, { id: 1, name: "Salim", age: 25 }];
const obj2 = [{ id: 1, name: "Salim", age: 25 }, { id: 2, name: "Salim", age: 25 }]

const isEqual = JSON.stringify(obj1) === JSON.stringify(obj2);
console.log(isEqual); // ✅ true (both objects are exactly the same)
