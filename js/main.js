Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			required: true
		} 
	},
	template: `
		<ul>
			<li v-for="detail in details">{{ detail }}</li>
		</ul>
	`
})

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
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
				<p>Shipping: {{ shipping }}</p>

				<product-details :details="details"></product-details>

				<div class="color">
					<div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
					</div>
				</div>

				<div class="size">
					<div v-for="size in sizes">
						<p>{{ size }}</p>
					</div>
				</div>

				<div class="buttons">
					<button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
					<button @click="removeFromCart">Remove from cart</button>
				</div>

			</div>
		</div>
	`,
	//  v-on:click="removeFromCart"  
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
                variantQuantity: 10,
                onSale: false
            }
         ],
         sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
			}
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart',
			this.variants[this.selectedVariant].variantId);
		},
		removeFromCart () {
			this.$emit('remove-from-cart',
			this.variants[this.selectedVariant].variantId);
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
		},
		shipping() {
			if (this.premium) {
					return "Free";
			} else {
					return 2.99
			}
		}
	}
})

let app = new Vue({
  el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		updateCart (id) {
			this.cart.push(id);
		},
		deleteFromCart (id) {
			for(let i = this.cart.length - 1; i >= 0; i--){
				if(this.cart[i] === id){
					this.cart.splice(i, 1);
				}
			}
		}
	}
})