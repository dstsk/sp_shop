// * Is mobile ?
const body = document.body
const isTouchScreen = isMobile.any
body.classList.add(`${isTouchScreen ? '_mobile' : '_pc'}`)

// * Basket: open / close
const cartBtn = document.querySelector('.cart')
const basket = document.querySelector('.basket')

let widthOfScreen
window.addEventListener('resize', () => {
  widthOfScreen = body.getBoundingClientRect().width
})

cartBtn.addEventListener('click', e => {
  e.preventDefault()
  if (widthOfScreen > 1199) basket.classList.toggle('hidden')
  else basket.classList.toggle('active')
})

// * Burger
const logo = document.querySelector('.logo')
const nav = document.querySelector('.nav')
const burgerBtn = document.querySelector('.burger')
burgerBtn.addEventListener('click', e => {
  e.preventDefault()
  nav.classList.toggle('active')
  burgerBtn.classList.toggle('active')
  logo.classList.toggle('active')
  body.classList.toggle('_lock')
})

// * Input masks
const nameInput = document.querySelector('.name-input')
const cardNumberInputs = document.querySelectorAll('.card-number-input')
const expireDateInput = document.querySelector('.expire-date-input')
const cvvCodeInput = document.querySelector('.cvv-code-input')
const emailInput = document.querySelector('.email-input')
const passwordInput = document.querySelector('.password-input')

const nameInputMask = IMask(nameInput, {
  mask: /^([a-zA-Z]*\s*)*\D$/,
})
const cardNumberMask = cardNumberInputs.forEach(i =>
  IMask(i, {
    mask: '0000',
  })
)
const expireDateMask = IMask(expireDateInput, {
  mask: '00/00',
})
const cvvCodeMask = IMask(cvvCodeInput, {
  mask: '000',
})

// * Input jumps
const numberInputs = document.querySelectorAll('.card-form__number-input')
let currentInputIdx = 0

numberInputs.forEach((i, _, arr) => {
  i.addEventListener('keyup', function (e) {
    const clicked = e.key
    allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Delete',
    ]
    const array = []
    if (allowedKeys.some(k => k === clicked)) {
      setTimeout(() => {
        array.push(this.value)
        if (
          this.value.length === 4 &&
          !this.classList.contains('expire-date-input')
        ) {
          numberInputs[++currentInputIdx].focus()
        } else if (array.join('').length === 5) {
          numberInputs[++currentInputIdx].focus()
        }
      }, 10)
    }
  })
  i.addEventListener('click', function (e) {
    currentInputIdx = Array.from(arr).indexOf(e.target)
  })
})

// * Input validation

class CustomValidation {
  constructor() {
    this.invalidities = []
    this.validityChecks = []
  }

  addInvalidity(message) {
    this.invalidities.push(message)
  }

  getInvalidities() {
    return this.invalidities.join('. \n')
  }

  checkValidity(input) {
    const isInvalidArr = []

    for (let i = 0; i < this.validityChecks.length; i++) {
      const isInvalid = this.validityChecks[i].isInvalid(input)

      isInvalidArr.push(isInvalid)
      const allInvalid = isInvalidArr.some(i => i === true)

      if (isInvalid) {
        this.addInvalidity(this.validityChecks[i].invalidityMessage)
      }

      const requirementElement = this.validityChecks[i].element

      if (requirementElement) {
        if (isInvalid) {
          requirementElement.classList.add('invalid')
          requirementElement.classList.remove('valid')
        } else {
          requirementElement.classList.remove('invalid')
          requirementElement.classList.add('valid')
        }
        if (allInvalid) {
          requirementElement.previousElementSibling.classList.add('invalid')
          requirementElement.previousElementSibling.classList.remove('valid')
        } else {
          requirementElement.previousElementSibling.classList.remove('invalid')
          requirementElement.previousElementSibling.classList.add('valid')
        }
      }
    }
  }
}

const nameValidityChecks = [
  {
    isInvalid: function (input) {
      const illegalCharacters = input.value.match(/^([a-zA-Z]*\s*)*\D$/)
      return illegalCharacters ? false : true
    },
    invalidityMessage: 'Only numbers are allowed',
    element: document.querySelector('label[for="name"] .input-requirements'),
  },
]

const cardNumberValidityChecks = function (inputNumber) {
  return [
    {
      isInvalid: function (input) {
        return input.value.length < 4
      },
      invalidityMessage: 'This input needs to be at least 4 characters',
      element: document.querySelector(
        `label[for="card-number-${inputNumber}"] .input-requirements`
      ),
    },
  ]
}

const expireDateValidityChecks = [
  {
    isInvalid: function (input) {
      return input.value.length < 5
    },
    invalidityMessage: 'This input needs to be at least 4 characters',
    element: document.querySelector(
      'label[for="expireDate"] .input-requirements'
    ),
  },
  {
    isInvalid: function (input) {
      return (
        Number(input.value.slice(0, 2)) === 0 ||
        Number(input.value.slice(0, 2)) > 12
      )
    },
    invalidityMessage: 'Incorrect month value',
    element: document.querySelector(
      'label[for="expireDate"] .input-requirements'
    ),
  },
  {
    isInvalid: function (input) {
      const date = new Date()
      const year = Number(date.getFullYear().toString().slice(-2))

      return input.value.slice(3, 5) < year
    },
    invalidityMessage: 'Incorrect year value',
    element: document.querySelector(
      'label[for="expireDate"] .input-requirements'
    ),
  },
]

const cvvValidityChecks = [
  {
    isInvalid: function (input) {
      return input.value.length < 3
    },
    invalidityMessage: 'This input needs to be at least 3 characters',
    element: document.querySelector('label[for="cvv"] .input-requirements'),
  },
]

const checkInput = function (input) {
  input.CustomValidation.invalidities = []
  input.CustomValidation.checkValidity(input)

  if (input.CustomValidation.invalidities.length == 0 && input.value != '') {
    input.setCustomValidity('')
  } else {
    const message = input.CustomValidation.getInvalidities()
    input.setCustomValidity(message)
  }
}

nameInput.CustomValidation = new CustomValidation()
nameInput.CustomValidation.validityChecks = nameValidityChecks

cardNumberInputs.forEach((el, i) => {
  el.CustomValidation = new CustomValidation()
  el.CustomValidation.validityChecks = cardNumberValidityChecks(i + 1)
})

expireDateInput.CustomValidation = new CustomValidation()
expireDateInput.CustomValidation.validityChecks = expireDateValidityChecks

cvvCodeInput.CustomValidation = new CustomValidation()
cvvCodeInput.CustomValidation.validityChecks = cvvValidityChecks

const paymentPage = document.querySelector('.payment-page__forms')
const inputs = paymentPage.querySelectorAll('input:not([type="submit"])')

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', function () {
    if (!this.value) {
      this.classList.remove('valid', 'invalid')
      this.nextElementSibling.classList.remove('valid', 'invalid')
    } else checkInput(this)
  })
}

// * Change payment method
const paymentMethod = document.querySelector('.payment-method')
const cardForm = document.querySelector('.card-form')
const paypalForm = document.querySelector('.paypal-form')
const btnCard = document.querySelector('.btn-card')
const btnPaypal = document.querySelector('.btn-paypal')

paymentMethod.addEventListener('click', e => {
  const clicked = e.target.closest('.payment-method__item')
  if (!clicked) return
  console.log(clicked.querySelector('input').value)
  if (clicked.querySelector('input').value === 'card-form') {
    cardForm.classList.remove('hidden')
    btnCard.classList.remove('hidden')

    paypalForm.classList.add('hidden')
    btnPaypal.classList.add('hidden')
  }
  if (clicked.querySelector('input').value === 'paypal-form') {
    cardForm.classList.add('hidden')
    btnCard.classList.add('hidden')

    paypalForm.classList.remove('hidden')
    btnPaypal.classList.remove('hidden')
  }
})
