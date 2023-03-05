var userNumber = null;

AFRAME.registerComponent("markerhandler", {
    init: async function(){
        //getting table number
        if(userNumber === null){
            this.askUserId();
        }

        //getting data from the toys collection
        var toys = await this.getToys();

        //markerFound event
        this.el.addEventListener("markerFound", () => {
            if(tableNumber !== null){
                var markerId = this.el.id;
                this.handleMarkerFound(toys, markerId);
            }
        });

        //markerLost event
        this.el.addEventListener("markerLost", () => {
            this.handleMarkerLost();
        });
    },
    askUserId: function(){
        var iconUrl = "https://cdn-icons-png.flaticon.com/512/5015/5015126.png";
        swal({
            title: "Welcome to Toy Store!",
            icon: iconUrl,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your user id",
                    type: "number",
                    min: 1
                }
            },
            closeOnClickOutside: false,
        }).then(inputValue => {
            userNunber = inputValue;
        });
    },
    handleMarkerFound: function(toys, markerId){
        //getting the toy based on id
        var toy = toys.filter(toy => toy.id === markerId)[0]; //***

        //checking if the toy is out of stock or not
        if(toy.is_out_of_stock){
            swal({
                icon: "warning",
                title: toy.toy_name.toUpperCase(),
                text: "Sorry, this toy is out of stock",
                time: 3000,
                buttons: false
            });
        }

        else{
            //updating the visibility of the content in the AR scene (model, toy description plane, price plane)
            var model = document.querySelector(`#model-${toy.id}`);
            model.setAttribute("visible", true);

            var toyMainPlane = document.querySelector(`main-plane-${toy.id}`);
            toyMainPlane.setAttribute("visible", true);

            var pricePlane = document.querySelector(`price-plane-${toy.id}`);
            pricePlane.setAttribute("visible", true);

            //button div displaying style
            var button_div = document.getElementById("button-div");
            button_div.style.display = "flex";
            
            var summary_button = document.getElementById("summary-button");
            var order_button = document.getElementById("order-button");

            if(tableNumber != null){
               //handling click events
                summary_button.addEventListener("click", () => {
                    swal({
                        icon: "warning",
                        title: "Order Summary",
                        text: "Toy Hydraulic Crane - $8.99" 
                    });
                });

                order_button.addEventListener("click", () => {
                    var uid;
                    userNumber <= 9 ? (uid = `U0${userNumber}`) : `U${userNumber}}`
                    this.handleOrder(uid, toy);

                    swal({
                        icon: "success",
                        title: "Order Successful",
                        text: "You will receive your order soon!"
                    });
                }); 
            }  
        }
    },
    handleOrder: function(uid, toy){
        //reading current user order details
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
            var details = doc.data();

            if(details["current_orders"][toy.id]){
                //increasing value of current quantity
                details["current_orders"][toy.id]["quantity"] += 1;

                //calculating the subtotal of the item
                var currentQuantity = details["current_orders"][toy.id]["quantity"];

                details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
            }

            else{
                details["current_orders"][toy.id] = {
                    item: toy.toy_name,
                    price: toy.price,
                    quantity: 1,
                    subtotal: toy.price * 1
                };
            }

            details.total_bill += toy.price;

            //updating the database
            firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update(details);
        });
    },
    //function to get the toys collection from the firestore database
    getToys: async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        });
    },
    handleMarkerLost: function(){
        //changing the button div visibility
        button_div = document.getElementById("button-div");
        button_div.style.display = "none";
    }
});