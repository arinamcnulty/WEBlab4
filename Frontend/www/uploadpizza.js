console.log(pizza_info);

const products = document.querySelector('.menu');

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

    const createSizeDiv = (size) => {
        return `
            <div class="size">
                <img src="assets/images/size-icon.svg"/><span>${size.size}</span>
            </div>
            <div class="weight">
                <img src="assets/images/weight.svg"/><span>${size.weight}</span>
            </div>
            <div class="price">
                <b>${size.price}</b>
            </div>
            <span>грн.</span>
            <button type="button" class="button" onclick="buy_${size === pizza.small_size ? 'small' : 'large'}()">Купити</button>`;
    };
    if (pizza.small_size) {
        let small_size = document.createElement("div");
        small_size.classList.add("size-s");
        small_size.innerHTML = createSizeDiv(pizza.small_size);
        new_pizza.querySelector(".size-info").appendChild(small_size);
    }
    if (pizza.big_size) {
        let big_size = document.createElement("div");
        big_size.classList.add("size-l");
        big_size.innerHTML = createSizeDiv(pizza.big_size);
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
