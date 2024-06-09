console.log(pizza_info);
const products = document.querySelector('.menu');
let total = parseFloat(localStorage.getItem('total')) || 0;
let amountOfPizza = parseFloat(localStorage.getItem('amount')) || 0;

// load up pizza for left panel
let cartOfpizzas = JSON.parse(localStorage.getItem("pizza")) || [];
for (let pizza of pizza_info) {
    let new_pizza = document.createElement('div');
    new_pizza.classList.add('pizza-item');
    new_pizza.setAttribute("type", pizza.type);
    if (pizza.content.pineapple)
        new_pizza.setAttribute("add-ons", "pineapple");
    if (pizza.content.mushroom)
        new_pizza.setAttribute("add-ons", "mushrooms");
    let single = (pizza.small_size && pizza.big_size) ? "" : "single";

    new_pizza.innerHTML = `
        <div class="pizza-obj">
            <img src="${pizza.icon}" alt="pizza-image">
            <div class="information">
                <span class="name">${pizza.title}</span>
                <span class="pizza-type">${pizza.type}</span>
                <span class="ingredients">${Object.values(pizza.content).flat().join(', ')}</span>
                <div class="size-info ${single}"></div>
            </div>
        </div>`;

    if (pizza.small_size !== undefined) {
        let small_size = document.createElement("div");
        small_size.classList.add("size-s");
        small_size.innerHTML = `<div class="size">
                                    <img src="assets/images/size-icon.svg" alt="size icon"><span>${pizza.small_size.size}</span>
                                </div>
                                <div class="weight">
                                    <img src="assets/images/weight.svg"alt="weight"/><span>${pizza.small_size.weight}</span>
                                </div>
                                <div class="price">
                                    <b>${pizza.small_size.price}</b>
                                </div>
                                <span>грн.</span>
                                <button type="button" class="button" onclick="buyPizza(event, 'small', '${pizza.title}', '${pizza.small_size.size}', ${pizza.small_size.price}, ${pizza.small_size.weight}, '${pizza.icon}')">
                                    Купити
                                </button>`;
        new_pizza.querySelector(".size-info").appendChild(small_size);
    }
    if (pizza.big_size !== undefined) {
        let big_size = document.createElement("div");
        big_size.classList.add("size-l");
        big_size.innerHTML = `<div class="size">
                                    <img src="assets/images/size-icon.svg"/><span>${pizza.big_size.size}</span>
                                </div>
                                <div class="weight">
                                    <img src="assets/images/weight.svg"/><span>${pizza.big_size.weight}</span>
                                </div>
                                <div class="price">
                                    <b>${pizza.big_size.price}</b>
                                </div>
                                <span>грн.</span>
                                <button type="button" class="button" onclick="buyPizza(event, 'large', '${pizza.title}', '${pizza.big_size.size}', ${pizza.big_size.price}, ${pizza.big_size.weight}, '${pizza.icon}')">
                                    Купити
                                </button>`;
        new_pizza.querySelector(".size-info").appendChild(big_size);
    }
    if (pizza.is_new) {
        let badge = document.createElement("div");
        badge.classList.add("new");
        badge.innerHTML = "Нова";
        new_pizza.appendChild(badge);
    }
    if (pizza.is_popular) {
        let badge = document.createElement("div");
        badge.classList.add("popular");
        badge.innerHTML = "Популярна";
        new_pizza.appendChild(badge);
    }
    products.appendChild(new_pizza);
}

// buy button for pizza
function buyPizza(event, size, name, pizzaSize, price, weight, img) {
    let buttonClicked = event.target;
    let item = buttonClicked.closest('.pizza-item');
    let itemName = name + (size === 'large' ? " (Велика)" : " (Мала)");
    for (let i = 0; i < cartOfpizzas.length; i++) {
        if (cartOfpizzas[i].name === itemName) return;
    }

    total += price;
    localStorage.setItem('total', total);
    amountOfPizza += 1;
    localStorage.setItem('amount', amountOfPizza);

    let pizza = {
        name: itemName,
        size: pizzaSize,
        price: price,
        weight: weight,
        img: img,
        amount: 1
    };
    cartOfpizzas.push(pizza);
    localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
    updateRightPanel();
}


//delete pizza item
function deletePizza(event) {
    let buttonClicked = event.target;
    let item = buttonClicked.closest('.details');
    let itemName = item.getElementsByClassName('pizza-name')[0].textContent.trim();
    let itemIndex = cartOfpizzas.findIndex(pizza => pizza.name === itemName);
    if (itemIndex !== -1) {
        total -= cartOfpizzas[itemIndex].price * cartOfpizzas[itemIndex].amount;
        localStorage.setItem('total', total);
        amountOfPizza -=1;
        localStorage.setItem('amount', amountOfPizza);
        cartOfpizzas.splice(itemIndex, 1);
        localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
        updateRightPanel();
    }
}

//plus/minus pizza quantity
function changeQuantity(event, delta) {
    let buttonClicked = event.target;
    let item = buttonClicked.closest('.details');
    let itemQuantity = item.querySelector('.amount');
    let itemName = item.getElementsByClassName('pizza-name')[0].textContent.trim();

    let itemIndex = cartOfpizzas.findIndex(pizza => pizza.name === itemName);
    let itemPrice = cartOfpizzas[itemIndex].price;

    if (itemIndex !== -1) {
        let currentQuantity = parseInt(itemQuantity.textContent);
        currentQuantity = Math.max(1, currentQuantity + delta);
        itemQuantity.textContent = currentQuantity;

        let minusButton = item.querySelector('.minus');

        if (currentQuantity === 1) {
            minusButton.classList.add('disabled');
        } else {
            minusButton.classList.remove('disabled');
        }

        total += itemPrice * delta;
        localStorage.setItem('total', total);
        amountOfPizza += delta;
        localStorage.setItem('amount', amountOfPizza);


        cartOfpizzas[itemIndex].amount = currentQuantity;
        localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
        updateRightPanel();
    }
}

//clear orders
function clearOrder(event) {
    cartOfpizzas = [];
    total = 0;
    amountOfPizza =0;
    localStorage.setItem('total', total);
    localStorage.setItem('amount', amountOfPizza);
    localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
    updateRightPanel();
}

//filter pizza in menu
function filterPizza(event) {
    let text = document.querySelector('.filter-name');
    let amount = document.querySelector('#amount-main');
    //all meat pineapple mushrooms seafood vegan
    document.querySelectorAll('.filters button').forEach(button => {
        button.classList.remove('chosen');
    });
    event.target.classList.add('chosen');
    const filterCategory = event.target.classList[0];
    const allPizzas = document.querySelectorAll('.pizza-item');
    allPizzas.forEach(pizza => {
        const pizzaType = pizza.getAttribute('type');
        const hasPineapple = pizza.getAttribute('add-ons')?.includes('pineapple');
        const hasMushrooms = pizza.getAttribute('add-ons')?.includes('mushrooms');

        switch (filterCategory) {
            case 'all':
                pizza.style.display = 'block';
                text.textContent='Усі піци';
                amount = '8';
                break;
            case 'meat':
                text.textContent='Мясін';
                amount = '5';
                if (pizzaType === 'М’ясна піца') {
                    pizza.style.display = 'block';
                } else {
                    pizza.style.display = 'none';
                }
                break;
            case 'pineapple':
                amount = '2';
                text.textContent='З ананасами';
                if (hasPineapple)
                    pizza.style.display = 'block';
                else
                    pizza.style.display = 'none';
                break;
            case 'mushrooms':
                amount = '3';
                text.textContent='З грибами';
                if (hasMushrooms)
                    pizza.style.display = 'block';
                else
                    pizza.style.display = 'none';
                break;
            case 'seafood':
                amount = '2';
                text.textContent='Морські';
                if (pizzaType === 'Морська піца')
                    pizza.style.display = 'block';
                else
                    pizza.style.display = 'none';
                break;
            case 'vegan':
                amount = '1';
                text.textContent='Веганські';
                if (pizzaType === 'Вега піца')
                    pizza.style.display = 'block';
                else
                    pizza.style.display = 'none';
                break;
            default:
                pizza.style.display = 'block';
                break;
        }
    });
}

//creates products in the cart
function updateRightPanel() {
    let orderList = document.querySelector('.order-list');
    orderList.innerHTML = '';
    let totalCart = document.querySelector('.sum');
    totalCart.textContent = `${total} грн`;
    let amountPizza = document.querySelector('#amount-cart');
    if (amountOfPizza >= 10) amountPizza.style.textIndent='3px';
    else amountPizza.style.textIndent='7px';
        amountPizza.textContent = `${amountOfPizza}`;

    cartOfpizzas.forEach(pizza => {
        let pizzaItem = document.createElement('div');
        pizzaItem.classList.add('order-item');
        pizzaItem.innerHTML = `
            <div class="details">
                <span class="pizza-name">${pizza.name}</span>
                <div class="order-info">
                    <div class="size">
                        <img src="assets/images/size-icon.svg"/><span>${pizza.size}</span>
                    </div>
                    <div class="weight">
                        <img src="assets/images/weight.svg"/><span>${pizza.weight}</span>
                    </div>
                </div>
                <form class="control-panel">
                    <span>${pizza.price * pizza.amount} грн</span>
                    <div class="amount-control">
                        <button type="button" class="minus ${pizza.amount === 1 ? 'disabled' : ''}" onclick="changeQuantity(event, -1)">-</button>
                        <span class="amount">${pizza.amount}</span>
                        <button type="button" class="plus" onclick="changeQuantity(event, 1)">+</button>
                    </div>
                    <button type="button" class="delete" onclick="deletePizza(event)">x</button>
                </form>
            </div>
            <div class="order-picture">
                <img src=${pizza.img}>
            </div>
        </div>`;

        orderList.appendChild(pizzaItem);
    });
}

updateRightPanel();
filterPizza();
