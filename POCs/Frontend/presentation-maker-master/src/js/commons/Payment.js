const paymentKey = process.env.REACT_APP_STRIPE_PK || "";
const stripe = window.stripe(paymentKey);

//create elements for ui
export function createElement(){
    return stripe.elements();
}

// create card
export function createCard(style = {}){
    var element = createElement();
    var card = element.create('card', {style: style});
    return card;
}

// create ui
export function getStripeUi(){
    let paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
            label: 'Demo total',
            amount: 200,
        }
    });

    var elements = createElement();
    var cardNumber = elements.create('cardNumber');
    cardNumber.mount('#cardNumber');
    var cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount('#cardExpiry');
    var cardCvc = elements.create('cardCvc');
    cardCvc.mount('#cardCvc');
    return cardNumber;
}

export function hostStripeUi() {
    var cardNumber = document.getElementById('cardNumber');
    cardNumber.mount('#cardNumber');
    var cardExpiry = document.getElementById('cardExpiry');
    cardExpiry.mount('#cardExpiry');
    var cardCvc = document.getElementById('cardCvc');
    cardCvc.mount('#cardCvc');
    return cardNumber;  
}

// create strip token
export function createStripeToken(card){
    return new Promise((resolve, reject) => {
        stripe.createToken(card)
        .then((result) => {
            resolve(result.token.id);
        }).catch((error) => {
            reject(error);
        })
    }) 
}

export function createStripeSource(element, sourceData) {
    return new Promise((resolve, reject) => {
        stripe.createSource(element, sourceData).then((result) => {
            resolve(result)
        }).catch((err) => {
            reject(err);
        })
    })
}

// ONLY FOR US CUSTOMERS or Wherever stripe supports ACH
export function createTokenForACH(achObject) {
    return new Promise((resolve, reject) => {
        stripe.createToken('bank_account', achObject).then((result) => {
            // data is nested within result.token;
            if (result.hasOwnProperty("token")) 
                result = result.token;
            
            resolve(result)
        }).catch((err) => {

            reject(err);
        })
    })
}