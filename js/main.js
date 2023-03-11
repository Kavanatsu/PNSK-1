let eventBus = new Vue()

Vue.component('product-tabs', {
	props: {
		reviews: {
				type: Array,
				required: false
		}
 	}, 
	template: `
	<div class="product-tabs">   
     <ul>
       <span :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab">{{ tab }}</span>
     </ul>
  
		<div v-show="selectedTab === 'Reviews'">
			<p v-if="!reviews.length">There are no reviews yet.</p>
			<ul>
				<li v-for="review in reviews">
				<p>{{ review.name }}</p>
				<p>Rating: {{ review.rating }}</p>
				<p>{{ review.review }}</p>
				</li>
			</ul>
		</div>

		<div v-show="selectedTab === 'Make a Review'">
		<product-review></product-review>
		</div>
	</div>
`,
	data() {
			return {
					tabs: ['Reviews', 'Make a Review'],
					selectedTab: 'Reviews'
			}
	}
})

Vue.component('info', {
	props: {
		shipping: {
			required: true
		},
		details: {
			type: Array,
			required: true
		}
	},
	template: `
		<div>
			<ul>
			<span :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab">{{ tab }}</span>
			</ul>

			<div v-show="selectedTab === 'Shipping'">
				<p>{{ shipping }}</p>
			</div>

			<div v-show="selectedTab === 'Details'">
				<ul>
					<li v-for="detail in details" >{{ detail }}</li>
				</ul>
			</div>
		</div>
	`,
	data() {
		return {
				tabs: ['Shipping', 'Details'],
				selectedTab: 'Shipping'
		}
	}
})

Vue.component('product-review', {
	template: `
	<form class="review-form" @submit.prevent="onSubmit">

	<p v-if="errors.length">
	<b>Please correct the following error(s):</b>
	<ul>
		<li v-for="error in errors">{{ error }}</li>
	</ul>
	</p>

	<p>
		<label for="name">Name:</label>
		<input id="name" v-model="name" placeholder="name">
	</p>

	<p>
		<label for="review">Review:</label>
		<textarea id="review" v-model="review"></textarea>
	</p>

	<p>
		<label for="rating">Rating:</label>
		<select id="rating" v-model.number="rating">
			<option>5</option>
			<option>4</option>
			<option>3</option>
			<option>2</option>
			<option>1</option>
		</select>
	</p>

	<p>Would you recommend this product?
		<label for="radioYes" class="form-radio-hidden">
			<input type="radio" id="radioYes" name="question" value="Yes" v-model="recommendation">
			<span class="radio"></span>
			<span class="text">Yes</span>
		</label>
		<label for="radioNo" class="form-radio-hidden">
			<input type="radio" id="radioNo" name="question" value="No" v-model="recommendation">
			<span class="radio"></span>
			<span class="text">No</span>
		</label>
	</p>

	<p>
		<input type="submit" value="Submit"> 
	</p>

	</form>
	`,
	data () {
		return {
			name: null,
			review: null,
			rating: null,
			recommendation: null,
			errors: []
		}
	},
	methods: {
		onSubmit () {
			if(this.name && this.review && this.rating && this.recommendation) {
			let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating,
				recommendation: this.recomendation
			}
			eventBus.$emit('review-submitted', productReview)
			this.name = null
			this.review = null
			this.rating = null
			this.recommendation = null
			} else {
				if(!this.name) this.errors.push("Name required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.rating) this.errors.push("Rating required.")
				if(!this.recommendation) this.errors.push("Recommendation required.")
			}
		}
	}
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

				<info :shipping="shipping" :details="details"></info>

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
			
			<product-tabs :reviews="reviews"></product-tabs>

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
                variantQuantity: 10,
                onSale: false
            }
         ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
				reviews: []
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
	},
	mounted() {
		eventBus.$on('review-submitted', productReview => {
				this.reviews.push(productReview)
		})
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