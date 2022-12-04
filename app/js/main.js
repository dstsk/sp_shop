/**========================================================================
 *                            * Is mobile ?
 *========================================================================**/

const body = document.body
const isTouchScreen = isMobile.any
body.classList.add(`${isTouchScreen ? '_mobile' : '_pc'}`)

/**========================================================================
 *                        * Basket: open / close
 *========================================================================**/

const cartBtn = document.querySelector('.cart-btn')
const basket = document.querySelector('.basket')

let widthOfScreen
window.addEventListener('resize', () => {
  widthOfScreen = body.getBoundingClientRect().width
})

cartBtn.addEventListener('click', e => {
  e.preventDefault()
  if (widthOfScreen > 1199) basket.classList.toggle('hidden')
  else {
    basket.classList.toggle('active')
    body.classList.toggle('_lock')
  }
})

/**========================================================================
 *                              * Burger
 *========================================================================**/

const logo = document.querySelector('.logo')
const nav = document.querySelector('.nav')
const burgerBtn = document.querySelector('.burger-btn')
console.log(burgerBtn)
burgerBtn.addEventListener('click', e => {
  e.preventDefault()
  nav.classList.toggle('active')
  burgerBtn.classList.toggle('active')
  logo.classList.toggle('active')
  if (!basket.classList.contains('active')) body.classList.toggle('_lock')
})

/**========================================================================
 *                            * Input masks
 *========================================================================**/

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

/**========================================================================
 *                          * Input autochange
 *========================================================================**/

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

/**========================================================================
 *                          * Input validation
 *========================================================================**/

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

// * Условия проверки инпутов / сообщения об ошибке

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

const emailValidityChecks = [
  {
    isInvalid: function (input) {
      let arr = Array.from(input.value)
      if (
        arr.filter(e => e === '@').length > 1 ||
        arr.filter(e => e === '@').length === 0 ||
        !arr
          .filter(el => el === '@' || el === '.')
          .join('')
          .includes('@.')
      )
        return true
    },
    invalidityMessage: 'Enter email',
    element: document.querySelector('label[for="email"] .input-requirements'),
  },
]
const passwordValidityChecks = [
  {
    isInvalid: function (input) {
      return input.value < 1
    },
    invalidityMessage: 'Enter password',
    element: document.querySelector(
      'label[for="password"] .input-requirements'
    ),
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

// * Создание экземпляров CustomValidation в инпутах

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

emailInput.CustomValidation = new CustomValidation()
emailInput.CustomValidation.validityChecks = emailValidityChecks

passwordInput.CustomValidation = new CustomValidation()
passwordInput.CustomValidation.validityChecks = passwordValidityChecks

// * Инициализация валидации на всех инпутах

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

/**========================================================================
 *                          * Change payment method
 *========================================================================**/

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

/**========================================================================
 *                      * Search button activation
 *========================================================================**/

const searchForm = document.querySelector('.search-form')
const btnSearch = document.querySelector('.btn-search')
const inputSearch = document.querySelector('.search-form__input')
btnSearch.addEventListener('pointerenter', function (e) {
  if (body.classList.contains('_pc')) inputSearch.focus()
  inputSearch.classList.remove('search-form__input--hidden')
  btnSearch.classList.add('search-form__icon--active')
})
btnSearch.addEventListener('click', function (e) {
  if (!inputSearch.value) e.preventDefault()
})

body.addEventListener('click', e => {
  const clicked = e.target.closest('.search-form')
  if (clicked === searchForm && !inputSearch.value) {
    e.preventDefault()
  } else {
    inputSearch.value = ''
    inputSearch.classList.add('search-form__input--hidden')
    btnSearch.classList.remove('search-form__icon--active')
  }
})

/**========================================================================
 *                  * Shopping basket interaction
 *========================================================================**/

const productBasket = [
  {
    id: 0,
    amount: 1,
    title: 'Amet minim mollit non',
    price: 525,
    description: 'Bla-bla-bla',
    category: "men's clothing",
    image: '../images/jacket.png',
    rating: {
      rate: 3.9,
      count: 525,
    },
  },
  {
    id: 1,
    amount: 1,
    title:
      'Amet minim mollit non deserunt ullamco est sit Amet minim mollit non deserunt ullamco est sit',
    price: 525,
    description: 'Bla-bla-bla',
    category: "men's clothing",
    image: '../images/sneaker.png',
    rating: {
      rate: 3.9,
      count: 525,
    },
  },
]
const productList = document.querySelector('.products__list')
const basketBill = document.querySelector('.basket__bill')
const promocodeForm = document.querySelector('.promocode-field__form')
const promocodeInput = document.querySelector('.promocode-field__input')
const promocodeBtn = document.querySelector('.promocode-field__btn')

let total, subtotal, tax, shipping
let discount = 1

// * Получение данных с сервера
const fetchData = async url => {
  const res = await fetch(url)
  return res.json()
}

// * Получение разметки для продукта в корзине
const getProductHTML = product => {
  return `
    <li class="products__item" data-product-id="${product.id}">
      <img
        class="products__img"
        src="${product.image}"
        alt="${product.title}"
      />
      <div class="products__description">
        <p class="products__text">${product.title}</p>
        <div class="products__calc">
          <div class="products__counter">
            <button class="products__substract">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8879 0C11.8037 0 12.6883 0.118056 13.5417 0.354167C14.3951 0.590278 15.1895 0.927083 15.925 1.36458C16.6604 1.80208 17.3334 2.32292 17.944 2.92708C18.5545 3.53125 19.0749 4.20486 19.505 4.94792C19.9352 5.69097 20.2717 6.48958 20.5145 7.34375C20.7574 8.19792 20.8788 9.08333 20.8788 10C20.8788 10.9167 20.7608 11.8021 20.5249 12.6562C20.289 13.5104 19.9525 14.3056 19.5154 15.0417C19.0783 15.7778 18.558 16.4514 17.9544 17.0625C17.3507 17.6736 16.6777 18.1944 15.9354 18.625C15.193 19.0556 14.3951 19.3924 13.5417 19.6354C12.6883 19.8785 11.8037 20 10.8879 20C9.97206 20 9.08745 19.8819 8.23406 19.6458C7.38067 19.4097 6.58626 19.0729 5.85082 18.6354C5.11538 18.1979 4.44238 17.6771 3.83183 17.0729C3.22127 16.4688 2.70091 15.7951 2.27075 15.0521C1.84059 14.309 1.50409 13.5139 1.26125 12.6667C1.01842 11.8194 0.897003 10.9306 0.897003 10C0.897003 9.08333 1.01495 8.19792 1.25085 7.34375C1.48674 6.48958 1.82324 5.69444 2.26034 4.95833C2.69744 4.22222 3.2178 3.54861 3.82142 2.9375C4.42504 2.32639 5.09803 1.80556 5.84041 1.375C6.58279 0.944444 7.3772 0.607639 8.22365 0.364583C9.0701 0.121528 9.95818 0 10.8879 0ZM10.8879 18.6667C11.6858 18.6667 12.4524 18.566 13.1879 18.3646C13.9233 18.1632 14.6137 17.8715 15.2589 17.4896C15.9041 17.1076 16.4869 16.6562 17.0073 16.1354C17.5277 15.6146 17.9786 15.0312 18.3602 14.3854C18.7418 13.7396 19.0332 13.0486 19.2344 12.3125C19.4356 11.5764 19.5397 10.8056 19.5467 10C19.5467 9.20139 19.4461 8.43403 19.2449 7.69792C19.0436 6.96181 18.7522 6.27083 18.3706 5.625C17.9891 4.97917 17.5381 4.39583 17.0177 3.875C16.4974 3.35417 15.9146 2.90278 15.2693 2.52083C14.6241 2.13889 13.9337 1.84722 13.1983 1.64583C12.4628 1.44444 11.6927 1.34028 10.8879 1.33333C10.09 1.33333 9.32335 1.43403 8.5879 1.63542C7.85246 1.83681 7.16212 2.12847 6.51688 2.51042C5.87163 2.89236 5.28883 3.34375 4.76847 3.86458C4.24811 4.38542 3.79714 4.96875 3.41554 5.61458C3.03394 6.26042 2.74254 6.95139 2.54134 7.6875C2.34013 8.42361 2.23606 9.19444 2.22912 10C2.22912 10.7986 2.32972 11.566 2.53093 12.3021C2.73213 13.0382 3.02354 13.7292 3.40513 14.375C3.78673 15.0208 4.23771 15.6042 4.75806 16.125C5.27842 16.6458 5.86123 17.0972 6.50647 17.4792C7.15171 17.8611 7.84206 18.1528 8.5775 18.3542C9.31294 18.5556 10.0831 18.6597 10.8879 18.6667ZM4.89336 9.33333H16.8824V10.6667H4.89336V9.33333Z"
                  fill="black"
                />
              </svg>
            </button>
            <span class="products__amount">${product.amount}</span>
            <button class="products__add">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8305 0C11.7476 0 12.6322 0.117188 13.4843 0.351562C14.3364 0.585938 15.1299 0.924479 15.8649 1.36719C16.6 1.8099 17.2732 2.33073 17.8846 2.92969C18.496 3.52865 19.0196 4.20247 19.4554 4.95117C19.8912 5.69987 20.2262 6.4974 20.4604 7.34375C20.6945 8.1901 20.8149 9.07552 20.8214 10C20.8214 10.918 20.7043 11.8034 20.4701 12.6562C20.236 13.5091 19.8977 14.3034 19.4554 15.0391C19.0131 15.7747 18.4928 16.4486 17.8943 17.0605C17.2959 17.6725 16.6227 18.1966 15.8747 18.6328C15.1267 19.069 14.3299 19.4043 13.4843 19.6387C12.6387 19.873 11.7541 19.9935 10.8305 20C9.91334 20 9.02873 19.8828 8.17664 19.6484C7.32456 19.4141 6.52776 19.0788 5.78625 18.6426C5.04473 18.2064 4.37152 17.6855 3.7666 17.0801C3.16169 16.4746 2.64133 15.7975 2.20553 15.0488C1.76973 14.3001 1.43474 13.5059 1.20058 12.666C0.966422 11.8262 0.846089 10.9375 0.839584 10C0.839584 9.08203 0.956665 8.19661 1.19083 7.34375C1.42499 6.49089 1.76322 5.69661 2.20553 4.96094C2.64783 4.22526 3.16819 3.55143 3.7666 2.93945C4.36502 2.32747 5.03823 1.80339 5.78625 1.36719C6.53426 0.93099 7.33106 0.595703 8.17664 0.361328C9.02223 0.126953 9.90684 0.00651042 10.8305 0ZM10.8305 18.75C11.637 18.75 12.4111 18.6458 13.1526 18.4375C13.8941 18.2292 14.5901 17.9362 15.2405 17.5586C15.891 17.181 16.4796 16.7253 17.0065 16.1914C17.5333 15.6576 17.9887 15.0684 18.3724 14.4238C18.7562 13.7793 19.0521 13.0827 19.2603 12.334C19.4684 11.5853 19.5725 10.8073 19.5725 10C19.5725 9.19271 19.4684 8.41797 19.2603 7.67578C19.0521 6.93359 18.7594 6.23698 18.3822 5.58594C18.0049 4.9349 17.5496 4.3457 17.0162 3.81836C16.4829 3.29102 15.8942 2.83529 15.2503 2.45117C14.6063 2.06706 13.9103 1.77083 13.1623 1.5625C12.4143 1.35417 11.637 1.25 10.8305 1.25C10.0239 1.25 9.24988 1.35417 8.50837 1.5625C7.76686 1.77083 7.07088 2.0638 6.42043 2.44141C5.76998 2.81901 5.18133 3.27474 4.65447 3.80859C4.1276 4.34245 3.67229 4.93164 3.28852 5.57617C2.90476 6.2207 2.6088 6.91732 2.40066 7.66602C2.19252 8.41471 2.08845 9.19271 2.08845 10C2.08845 10.8073 2.19252 11.582 2.40066 12.3242C2.6088 13.0664 2.90151 13.763 3.27877 14.4141C3.65603 15.0651 4.11134 15.6576 4.64471 16.1914C5.17808 16.7253 5.76673 17.181 6.41068 17.5586C7.05462 17.9362 7.7506 18.2292 8.49862 18.4375C9.24663 18.6458 10.0239 18.75 10.8305 18.75ZM11.4549 9.36523H15.8259V10.6152H11.4549V15H10.206V10.6152H5.83503V9.36523H10.206V5H11.4549V9.36523Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

          <div class="products__price">$ ${(
            product.price * product.amount
          ).toFixed(2)}</div>
        </div>
      </div>
      <button class="products__delete" data-btn-id="${product.id}">
        <svg
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.756 9L18.7001 16.9629L17.6639 18L9.70834 10.0487L1.75274 18L0.716553 16.9629L8.66064 9L0.716553 1.03713L1.75274 0L9.70834 7.95134L17.6639 0L18.7001 1.03713L10.756 9Z"
            fill="#CFCFCF"
          />
        </svg>
      </button>
    </li>
  `
}

// * Получение разметки для счёта
const getBillHTML = () => {
  return `
    <div class="bill__row bill__subtotal">
      <div class="bill__row-name">Subtotal</div> 
      <div class="bill__row-price">$${subtotal.toFixed(2)}</div>
    </div>
    <div class="bill__row bill__tax">
      <div class="bill__row-name">Tax</div>
      <div class="bill__row-price">$${tax.toFixed(2)}</div>
    </div>
    <div class="bill__row bill__shipping">
      <div class="bill__row-name">Shipping</div>
      <div class="bill__row-price">$${shipping.toFixed(2)}</div>
    </div>
    <div class="bill__row bill__total">
      <div class="bill__row-name">Total</div>
      <div class="bill__row-price">$${total.toFixed(2)}</div>
    </div>
  `
}

// * Добавление продукта в корзину
const addProductToBasket = product => {
  //  Если продукт уже есть в корзине, то увеличиваем его количество
  //  Если нет, то добавляем в корзину с полем amount = 1
  const index = productBasket.findIndex(p => p.id === product.id)
  if (index >= 0) {
    productBasket[index].amount++
  } else {
    product.amount = 1
    productBasket.push(product)
  }

  //  Обновляем корзину
  updateBasket()
}

// * Удаление продукта из корзины
const removeProductFromBasket = () => {
  //  Инициализируем кнопки удаления продуктов
  const removeProductBtns = document.querySelectorAll('.products__delete')

  removeProductBtns.forEach(btn =>
    btn.addEventListener('click', function (e) {
      // Определяем id удаляемого продукта
      const removedProductId =
        +e.target.closest('.products__item').dataset.productId

      // Определяем индекс удаляемого продукта в productBasket
      const productIndexInBasket = productBasket.findIndex(
        p => p.id === removedProductId
      )

      // Удаляем продукт из корзины
      productBasket.splice(productIndexInBasket, 1)

      // Обновляем корзину
      updateBasket()
    })
  )
}

// * Изменение количества продуктов по кнопкам + / -
const changeAmountOfProduct = () => {
  //  Инициализируем кнопки + / -
  const productCounters = document.querySelectorAll('.products__counter')

  productCounters.forEach(el =>
    el.addEventListener('click', e => {
      const substractBtn = e.target.closest('.products__substract')
      const addBtn = e.target.closest('.products__add')

      // Определяем id продукта
      const clickedProductId =
        +e.target.closest('.products__item').dataset.productId

      // Определяем индекс продукта в productBasket
      const productIndexInBasket = productBasket.findIndex(
        p => p.id === clickedProductId
      )

      // Если - , то убавляем на 1
      if (substractBtn) {
        productBasket[productIndexInBasket].amount--
        // Если 0 , то удаляем
        if (productBasket[productIndexInBasket].amount < 1)
          productBasket.splice(productIndexInBasket, 1)
      }
      // Если + , то прибавляем на 1
      if (addBtn) {
        productBasket[productIndexInBasket].amount++
      }

      // Обновляем корзину
      updateBasket()
    })
  )
}

// * Обновляем счёт
const updateBasketBill = () => {
  const basketIsEmpty = !productBasket.length

  // Если корзина пустая
  if (basketIsEmpty) {
    subtotal = 0
    tax = 0
    shipping = 0
    total = 0
  }

  // Если в корзине что-то есть
  if (!basketIsEmpty) {
    subtotal = productBasket
      .map(p => p.price * p.amount)
      .reduce((p, c) => p + c)
    tax = productBasket.map(p => p.amount).reduce((p, c) => p + c) * 50
    shipping = 150
    total = (subtotal + tax + shipping) * discount
  }

  basketBill.innerHTML = ''
  basketBill.insertAdjacentHTML('beforeend', getBillHTML())
}

// * Обновляем счётчик товаров в корзине на иконке в хедере
const cartCounterUpdate = () => {
  // Определяем сумарное количество товаров в корзине
  const amount = productBasket.length
    ? productBasket.map(el => el.amount).reduce((p, c) => p + c)
    : 0

  // Разметка для счётчика
  const html = amount ? `<span>${amount}</span>` : ``

  // Если счётчик есть, то обновляем значение
  cartBtn.querySelector('span')?.remove()
  cartBtn.insertAdjacentHTML('beforeend', html)
}

// * Активация промокода
promocodeBtn.addEventListener('click', e => {
  e.preventDefault()

  // Кодовое слово
  const codeWord = 'sale'

  // Если корзина пустая, то ничего не делаем
  if (!productBasket.length) return

  // Если значение совпало, применяем скидку
  if (promocodeInput.value === codeWord) {
    discount = 0.5

    // Обновляем счёт
    updateBasketBill()

    // Добавляем ярлычок
    basketBill
      .querySelector('.bill__total')
      .insertAdjacentHTML(
        'beforeend',
        `<div class="bill__discount">$${total.toFixed(2)}</div>`
      )

    // Возвращаем значение на случай, если будут добавляться новые товары
    discount = 1
  }
})

// * Обновление корзины
const updateBasket = () => {
  productList.innerHTML = ''
  productBasket.forEach(p =>
    productList.insertAdjacentHTML('beforeend', getProductHTML(p))
  )

  // Инициализируем новые кнопки
  cartCounterUpdate()
  removeProductFromBasket()
  changeAmountOfProduct()

  // Обновляем счёт
  updateBasketBill()
}

// * Получение случайного продукта с сервера
const getRandomProduct = async url => {
  const product = await fetchData(url)
  addProductToBasket(product)
}

// * Заполняем корзину двумя дефолтными товарами
updateBasket()

// * Получение слуйчайного числа
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// * По нажатию на логотип добавляем в корзину новый продукт
logo.addEventListener('click', e => {
  e.preventDefault()
  getRandomProduct(`https://fakestoreapi.com/products/${randomInt(3, 20)}`)
})
