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
       <span :class="{ activeTab: selectedTab !== tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab">{{ tab }}</span>
     </ul>
  
		<div v-show="selectedTab === 'Reviews'">
			<p v-if="!reviews.length">There are no reviews yet.</p>
			<ul>
				<li v-for="review in reviews">
				<p>Name: {{ review.name }}</p>
				<p>Review: {{ review.review }}</p>
				<div class="rating-result">
					<span :class="{ active: review.rating >= 1 }"></span>	
					<span :class="{ active: review.rating >= 2 }"></span>    
					<span :class="{ active: review.rating >= 3 }"></span>  
					<span :class="{ active: review.rating >= 4 }"></span>    
					<span :class="{ active: review.rating >= 5 }"></span>
				</div>
				
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
					selectedTab: 'Reviews',
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
		<div class="info">
			<ul>
			<span :class="{ activeTab: selectedTab !== tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab">{{ tab }}</span>
			</ul>

			<div v-show="selectedTab === 'Shipping'">
				<p>{{ shipping }}</p>
			</div>

			<div v-show="selectedTab === 'Details'">
				<ul>
					<li v-for="detail in details">{{ detail }}</li>
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
		<div id="rating">
			<input v-model="rating" type="radio" id="star-5" name="rating" value="5">
			<label for="star-5" title="Оценка «5»"></label>	
			<input v-model="rating" type="radio" id="star-4" name="rating" value="4">
			<label for="star-4" title="Оценка «4»"></label>    
			<input v-model="rating" type="radio" id="star-3" name="rating" value="3">
			<label for="star-3" title="Оценка «3»"></label>  
			<input v-model="rating" type="radio" id="star-2" name="rating" value="2">
			<label for="star-2" title="Оценка «2»"></label>    
			<input v-model="rating" type="radio" id="star-1" name="rating" value="1">
			<label for="star-1" title="Оценка «1»"></label>
		</div>
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
			errors: []
		}
	},
	methods: {
		onSubmit () {
			if(this.name && this.review && this.rating) {
			let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating,
			}
			eventBus.$emit('review-submitted', productReview)
			this.name = null
			this.review = null
			this.rating = null
			this.errors = [];
			} else {
				if(!this.name) this.errors.push("Name required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.rating) this.errors.push("Rating required.")
			}
		},
		
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