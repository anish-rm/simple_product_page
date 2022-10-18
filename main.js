// Creating Vue Component

//we need to have a global channel for the addreview issue in product-review component

//it will be new vue instance

var eventBus=new Vue();


Vue.component('product', {
    props: {
        premiums: {
            type : Boolean,
            required: true,
            default: false
        },
        
    },
    template: `
    <div class="product">
                
                <div class="product-image">
                    <a v-bind:href="link"><img v-bind:src="image" alt=""></a>
                    
                </div>
                <div class="product-info">
                    <h1 :style="styleObject">{{title}} {{onSalee}}</h1>
                    <!-- <p v-if="instock">In stock</p>
                    <p v-else>Out of stock</p> -->

                    

                    <!-- Now we are using else if -->
                    <!-- <p v-if="inventory > 10">In Stock</p>
                    <p v-else-if="inventory < 10 && inventory>0">Almost Sold Out</p>
                    <p v-else>Out of stock</p>  -->



                    <!-- v-if will actually add or remove element from DOM -->
                    <!-- If our application calls an element to be displayed and not displayed frequently, there's more efficient  Vue directive -> v-show-->
                    <!-- v-show-> It just toggles the visiblity on and off -->
                    <p :class="{disabledText:!instock}">In Stock</p>
                    <p v-if="onSale">On Sale!</p>
                    <p v-else>Not On Sale</p>
                    <p> Shipping {{cost}}</p>



                    <!-- To display the list in our data -->
                    <ul>
                        <li v-for="i in details">{{i}}</li>
                    </ul>
                    <!-- Something more complex. What if we have variant details -->
                    <!-- <ul>
                        <li v-for="i in variants">{{i.variantColor}}</li>
                    </ul> -->
                    <!-- When rendering list like this use a special key attribute so Vue can keep track of each node's identity-->
                    <!-- <div v-for="i in variants"  :key="i.variantId" >
                        <button @mouseover="changeImage(i.variantImage) noitemsdisplay()" :style="{background:i.coolor}">{{i.variantColor}}</button>
                    </div> -->

                    <!-- Now we can update our image using properties. Properties are like cache. It will not rerun everytime. Only when value changes it rerun. It is very efficient to use than methods -->

                    <!-- here j is an index -->
                    <div v-for="(i,j) in variants"  :key="i.variantId" >
                        <button @mouseover="changeImage(j),noitemsdisplay()" :style="{background:i.coolor}">{{i.variantColor}}</button>
                    </div>



                    <!-- Event Handling -->
                    <!-- <button v-on:click="cart+=1">Add to Cart</button><br>
                    <button v-on:click="cart-=1">Remove from Cart</button> -->
                    <!-- Instead of above we can call the method -->

                    <!-- Class Binding -->
                    <!-- Disabled attribute is html attribute if instock = false then button will disable -->
                    <button v-on:click="addToCart()" v-bind:disabled="!instock" :class="{disabledButton:!instock}">Add to Cart</button><br>
                    <button v-on:click="removeFromCart(),noitemsdisplay()">Remove from Cart</button>

                    <p>{{goingToOver}}</p>
                    <p>{{temp}}</p>


                </div>
                <product-tabs :reviews="reviews"></product-tabs>
    
                
            </div>
    `,
    data(){
        return {
            brand : 'Anish',
            product : 'Socks',
            description : 'A pair of warm,  sfuzzyocks',
            selectedProd : 0,
            link : 'https://v2.vuejs.org/v2/guide/',
            inventory : 0,
            onSale : true,
            temp:'',
            details : ["80% cotton", "20% polyster", "Gender-neutral"],
            variants : [
                {
                    variantId:2234,
                    variantColor: "green",
                    variantImage: 'green.jpg',
                    coolor : '#39ac39',
                    variantQuantity :10,
                    variantCart :0
                },
                {
                    variantId:2235,
                    variantColor: "blue",
                    variantImage: 'blue.png',
                    coolor : '#006699',
                    variantQuantity :4,
                    variantCart :0
                }
            ],
            styleObject : {
                fontSize : '3rem'
            },
            reviews:[]
        }
    },
    methods: {
        addToCart : function(){
            this.$emit('add-to-cart', this.variants[this.selectedProd].variantId,this.variants[this.selectedProd].variantQuantity)
            this.variants[this.selectedProd].variantQuantity-=1
            this.variants[this.selectedProd].variantCart+=1
            this.noitemsdisplay()
        },
        removeFromCart(){  //this is short form of above
            this.$emit('remove-cart', this.variants[this.selectedProd].variantId,this.variants[this.selectedProd].variantCart)
            if(this.variants[this.selectedProd].variantCart>0){
            this.variants[this.selectedProd].variantQuantity+=1
            }
            this.variants[this.selectedProd].variantCart-=1
        },
        changeImage:function(index){
            this.selectedProd=index
        },
        noitemsdisplay(){
            if(this.variants[this.selectedProd].variantCart<0){
                this.temp = 'No items in the cart'
                this.variants[this.selectedProd].variantCart=0
            }
            else{
                this.temp=''
            }
            console.log("he")
        },
        // we will no longer use this after chap-9 comm b/w grandchild and grandparent
        // addReview(productReview) {
        //     // we are going to put the object in the array to form a array of object
        //     this.reviews.push(productReview)
        // }
    },
    computed: {
        title(){
            return(this.brand+" "+this.product);
        },
        image(){
            return(this.variants[this.selectedProd].variantImage);
        },
        instock(){
            return(this.variants[this.selectedProd].variantQuantity);
        },
        goingToOver(){
            if(this.variants[this.selectedProd].variantQuantity<5 && this.variants[this.selectedProd].variantQuantity>0){
                return("Soon going to out of Stock");
            }
        },
        onSalee(){
            if(this.onSale)
            return("is on Sale");
        },
        cost(){
            if(this.premiums == true){
                return('$0.00');
            }
            else{
                return('$12.67');
            }
        },
    },
    mounted(){//it is a lifecycle hook refer that. It will run as soon as the component is mounted to the dom
        eventBus.$on('review-submitted', productReview=>{
            this.reviews.push(productReview)
        })
    }

});

Vue.component('productdetails',{
    props : {
        details : {
            type: String,
            required:true
        }
    },
    template :`
    <div>
        <div class="heading">
            <h1>Product Details</h1>
        </div>
        <div class="details">
            <p>{{details}}</p>
        </div>
    </div>
    `
});

Vue.component('product-tabs', {
    props : {
        reviews : {
            type: Array,
            required: true
        }
    },
    template:`
    <div>
        <span class="tab"
            v-for = "(tab,index) in tabs"
            :key="index"
            @click="selectedTab = index" :class="{activeTab : tabs[selectedTab] === tabs[index]}">
            {{tab}}</span>

            <div v-show="tabs[selectedTab]=== 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!(reviews.length)">The are no reviews yet</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{review.name}}</p>
                Review :{{review.review}}</p>
                Rating :{{review.rating}}</p>
                </li>
            </ul>
        </div>
        <!-- we are listening for review-submited event -->
        <!-- we will get the error that addReview is error -->
        <!-- we need to make our grandchild communicate with grandparent so below line will be changed -->
        <!-- <product-review v-show="tabs[selectedTab]=== 'Make a review'" @review-submitted="addReview"></product-review> -->
        <product-review v-show="tabs[selectedTab]=== 'Make a review'"></product-review>

    </div>

    
    `,
    data(){
        return{
            // these we are going to display in span tag so we will be using v-for in span tag and assigning key to index
            tabs : ['Reviews', 'Make a review'],
            // this selectedTab is because we want to know which tab the user is currently selecting
            selectedTab:0
        }
    }
})

Vue.component('product-review',{
    template :`
    <!-- After the form is submitted we want it to do something so we are adding @submit event in the form. It will trigger the method onSubmit. -->
    <!-- Here we are using .prevent so the page will not submit when we click the submit button -->
    <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
            <b>Please correct the following errors</b>
            <ul>
                <li v-for="error in errors">
                <p>{{error}}</p>
                </li>
            </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <!-- For binding with data we use v-model now this input is bind to the data name -->
        <input  v-model="name" placeholder="name">
      </p>

      <!-- we may want to validate the form using required. It is suggested to do manually -->
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <!-- here we are giving v-model.number because if we dont add number it will be taken as string so to type convert we are adding number-->
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      
      <p>Would you recommend this product?</p>
      <div style="display:flex">
      <label for="yes" style="margin-top:5px">YES</label>
      <input type="radio" name="yes/no" id="yes" value="YES" v-model="recommend">
      </div>
      <div style="display:flex">
      <label for="no" style="margin-top:5px">NO</label><br>
      <input type="radio" name="yes/no" id="no" value="NO" style="margin-left:10px;" v-model="recommend">
      </div>
      <!--<input type="checkbox" id="checkbox" v-model="checked">
        <label for="checkbox">{{ checked }}</label>-->
        <!--<input
        type="checkbox"
        v-model="toggle"
        true-value="yes"
        false-value="no"
        > 
        <input type="radio" v-model="pick" v-bind:value="a">-->
        <!--<select v-model="selected">
        <option v-bind:value="{ num: 123 }">123</option>
        </select> -->
        <input v-model.trim="msg">
        <input type="submit" value="Submit">  
        <input type="reset" value="reset">
      </p>    
    
    </form>
    `,
    data(){
        return {
            name:null,
            review:null,
            rating:null,
            recommend:null,
            errors:[],
            checked:null,
            toggle:null,
            pick:null,
            selected:null,
            msg:null
        }
    },
    methods:{
        onSubmit(){
            // we are going to create an object that will contain the form detail
            if(this.name && this.review && this.rating){
            let productReview = {
                name : this.name,
                review : this.review,
                rating : this.rating,
                recommend: this.recommend,
                toggle : this.toggle
            }
            // after we submitted the name,review,rrating must be null to collect the next data
            // this.$emit('review-submitted',productReview)
            // the above line need to be changed for communication b/w grandchild and grandparent
            eventBus.$emit('review-submitted',productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
        }
            // we are not sending it anywhere so to send we can use event as we learned earlier
            // Now in the component get the event
            else{
                if(!this.name){
                    this.errors.push('Name Required')
                }
                if(!this.review){
                    this.errors.push('Review Required')
                }
                if(!this.rating){
                    this.errors.push('Rating Required')
                }
            }
        },
    },
    computed : {
        a(){
            return 'anish'
        }
    }
});



var app = new Vue({
    el : '#app',
    data :{
    //    To pass data into our component
    premium:true,
    cart : [],
    tempcart : [],
    noitems : 0,
    displaynoitems : '',
    details :'Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum fugiat reprehenderit repellendus laborum eius explicabo quia minima culpa? Alias, porro. '
    },
    methods: {
        updatecart(id,n){
            // this.cart+=1
            if(n>0)
            this.cart.push(id)
        },
        deleteCart(id,n1){
            temp=-1
            console.log("hi")
            for(i=0;i<this.cart.length;i++){
                if(this.cart[i]==id){
                    temp=i
                    break
                }
            }
            if(temp>=0){
                this.cart.splice(i,i+1)
            }
        }
    },
});