let myName: 'Bob' = "Bob";
const myName2: 'Bob' = "Bob";

let numberOfWheels: number = 4;
let isStudent: boolean = false;

type Food = string;

let favoriteFood: Food = "pizza";

type Address = {
  street: string;
  city: string;
  country: string;
};

type Person = {
  name: string;
  age: number;
  isStudent: boolean;
  address?: Address;
};

let person: Person = {
  name: "Joe",
  age: 33,
  isStudent: true,
  address: {
    street: "dsjfsdk",
    city: "",
    country: "dkfja",
  },
};

let person2: Person = {
  name: "djs",
  age: 22,
  isStudent: false,
};

type Pizza = {
  name: string;
  price: number;
};

type Order = {
  id: number;
  pizza: Pizza;
  status: string;
};

let age = 100;
let ages: number[] = [100, 33, 222];

let people: Array<Person> = [person, person2];

//unions 联合类型
type User = {
  username: string, 
  role: "guest" | "member" | "admin",
}
type UserRole = "guest" | "member" | "admin"; 
let userRole: UserRole = "member";

type Order1 = {
  id: number, 
  pizza: Pizza,
  status: "ordered" | "completed",
}

function getPizzaDetail(identifier: string | number)  {
  if(typeof identifier === 'string') {

  }
}

let value: any = 1; 
value.toUpperCase();
//Don't use **any** type
//instead of use any, use unknown;

interface Todo {
  title: string, 
  description: string,
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}


//实现部分工具类型(Utility types);
//Partial1<U> 将所有属性变为可选
type Partial1<U> = {
  [P in keyof U]?: U[P]
}

interface User1 {
  id: number, 
  name: string, 
  email: string,
}

type PartialUser1 = Partial1<User1>;

let newUser:PartialUser1 = {
  id: 333,
}
console.log(newUser);

//Required<U> 将所有类型变为必填
type RequiredUser1<U> = {
  [P in keyof U]-?: U[P]
}

let newUser2: RequiredUser1<PartialUser1> = {
  name: 'hello',
  id: 33, 
  email: 'dkfj',
}

//Readonly<U> 将所有属性变为只读
type Readonly1<U> = {
  readonly [P in keyof U]: U[P]
}

let newUser3: Readonly<User1> = {
  id: 333, 
  name: 'djfja', 
  email: 'sddsfjdf',
}

newUser3.id = 3443;
function add(pizza: Omit<Pizza, 'id'>): void {

}
function add1<T>(array: T[], item: T): T[] {
  array.push(item);
  return array;
}

class Person1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

function newOne<T>(ctor: { new(...args: any[]): T }) {

}