
console.log(pizza_info);
const products = document.querySelector('.menu');

//load up pizza for left panel
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
                                    <img src="assets/images/size-icon.svg"/><span>${pizza.small_size.size}</span>
                                </div>
                                <div class="weight">
                                    <img src="assets/images/weight.svg"/><span>${pizza.small_size.weight}</span>
                                </div>
                                <div class="price">
                                    <b>${pizza.small_size.price}</b>
                                </div>
                                <span>грн.</span>
                                <button type="button" class="button" onclick="buyPizza(event, 'small')">
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
                                <button type="button" class="button" onclick="buyPizza(event, 'large')">
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

class Pizza {
    constructor(name, size, price, weight, img) {
        this.name = name;
        this.size = size;
        this.price = price;
        this.weight = weight;
        this.img = img;
        this.amount = 1;
    }
}

//buy button for pizza
function buyPizza(event, size) {
    let buttonClicked = event.target;
    let item = buttonClicked.closest('.pizza-item');
    let itemName = item.querySelector('.name').textContent + (size === 'large' ? " (Велика)" : " (Мала)");
    let itemSize = item.querySelector(`.size-${size === 'large' ? 'l' : 's'} .size span`).textContent;
    let itemPrice = parseFloat(item.querySelector(`.size-${size === 'large' ? 'l' : 's'} .price b`).textContent);
    let itemWeight = parseFloat(item.querySelector(`.size-${size === 'large' ? 'l' : 's'} .weight span`).textContent);
    let itemImg = item.querySelector("img").getAttribute('src');

    let pizza = new Pizza(itemName, itemSize, itemPrice, itemWeight, itemImg);
    cartOfpizzas.push(pizza);
    localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
    updateRightPanel();
}
//delete pizza item
function deletePizza(event){
    let buttonClicked = event.target;
    let item = buttonClicked.closest('.details');
    let itemName = item.getElementsByClassName('pizza-name')[0].textContent.trim();
    let itemIndex = cartOfpizzas.findIndex(pizza => pizza.name === itemName);
    if (itemIndex !== -1) {
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
        cartOfpizzas[itemIndex].amount = currentQuantity; // Update the quantity in the array
        localStorage.setItem('pizza', JSON.stringify(cartOfpizzas)); // Save to local storage
        updateRightPanel(); // Update the right panel
    }
}
//clear orders
function clearOrder(event){
    cartOfpizzas = [];
    localStorage.setItem('pizza', JSON.stringify(cartOfpizzas));
    updateRightPanel();
}

function filterPizza(event){

}
//creates products in the cart
function updateRightPanel() {
    let orderList = document.querySelector('.order-list');
    orderList.innerHTML = '';

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