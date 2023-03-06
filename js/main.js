Vue.component('product', {
	template: `
		<div class="product">
			<div class="product-image">
				<img :src="image" :alt="altText"/>
			</div>
			<div class="product-info">
				<div class="title">
					<h1>{{ title }} </h1><span>{{ sale }}</span>
				</div>
				<p v-if="inStock">In stock</p>
				<p v-else :class="{ disabledText: !inStock }">Out of Stock</p>
				<a :href="link">More products like this</a>
				<ul>
					<li v-for="detail in details">{{ detail }}</li>
				</ul>
				<div class="color">
					<div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
					</div>
				</div>
				<div class="size">
					<div v-for="size in sizes">
						<p>{{ size }}</p>
					</div>
				</div>
				<div class="cart">
					<p>Cart({{ cart }})</p>
				</div> 
				<div class="buttons">
					<button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
					<button v-on:click="removeFromCart" v-if="cart > 0">Remove from cart</button>
				</div>
			</div>
		</div>
	`,
	data() {
			return {
				product: "Socks",
        brand: 'Vue Mastery',
        selectedVariant: 0,
        altText: "A pair of socks",
        link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10,
                onSale: true
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0,
                onSale: false
            }
         ],
         sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
         cart: 0
			}
	},
	methods: {
		addToCart() {
			this.cart += 1
		},
		removeFromCart () {
				this.cart -= 1
		},
		updateProduct(index) {
				this.selectedVariant = index;
				console.log(index);
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product;
		},
		image() {
				return this.variants[this.selectedVariant].variantImage;
		},
		inStock() {
				return this.variants[this.selectedVariant].variantQuantity;
		},
		sale() {
				if (this.variants[this.selectedVariant].onSale) return "On sale";
		}
	}
})
let app = new Vue({
  el: '#app'
})