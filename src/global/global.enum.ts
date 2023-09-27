export enum Gender {
  M = "male",
  F = "female",
}
export enum ClothingGender {
  M = "male",
  F = "female",
  U = "unisex"
}
export enum Role {
  USER = "user",
  ADMIN = "admin",
}
export enum TimePeriods {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
export enum Category {
  Jeans = "Jeans",
  Jackets = "Jackets",
  Shirts = "Shirts",
  Dresses = "Dresses",
  Skirts = "Skirts",
  Pants = "Pants",
  ButtonShirts = "Button Shirts",
  Sweaters = "Sweaters",
  Accessories = "Accessories",
  Outerwear = "Outerwear",
  Tops = "Tops",
  Activewear = "Activewear",
  Formalwear = "Formalwear",
  Sleepwear = "Sleepwear",
  Loungewear = "Loungewear",
  Swimwear = "Swimwear",
  Underwear = "Underwear",
  Sportswear = "Sportswear",
}
export enum Fabric {
  Denim = "Denim",
  Corduroy = "Corduroy",
  Cotton = "Cotton",
  Leather = "Leather",
  Wool = "Wool",
  Silk = "Silk",
  Polyester = "Polyester",
  Nylon = "Nylon",
  Spandex = "Spandex",
  Rayon = "Rayon",
  Linen = "Linen",
  Velvet = "Velvet",
  Knit = "Knit",
  Synthetic = "Synthetic",
}

export enum Season {
  SpringSummer = "Spring/Summer",
  FallWinter = "Fall/Winter",
  Yearly = "Yearly"
}
export enum Color {
  Red = "Red",
  Blue = "Blue",
  Green = "Green",
  Yellow = "Yellow",
  Black = "Black",
  White = "White",
  Gray = "Gray",
  Purple = "Purple",
  Pink = "Pink",
  Orange = "Orange",
  Brown = "Brown",
  Beige = "Beige",
  Navy = "Navy",
  Teal = "Teal",
  Mix = "Mix",
}


export enum DayOfWeek {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}
export enum Month {
  Jan,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec
};
export enum CardValidationRegex {
  VISA = "(^4[0-9]{12}(?:[0-9]{3})?$)",
  MASTERCARD = "^5[1-5][0-9]{14}|^(222[1-9]|22[3-9]\\d|2[3-6]\\d{2}|27[0-1]\\d|2720)[0-9]{12}$",
  AMERICAN_EXPRESS = "/^3[47]\d{13,14}$/",
  DISCOVER = "/^(?:6011\d{12})|(?:65\d{14})$/"
}
export enum CardType {
  MASTERCARD = 'mastercard',
  VISA = 'visa',
  AMERICAN_EXPRESS = 'amex',
  DISCOVER = 'discover'
}