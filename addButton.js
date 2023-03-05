AFRAME.registerComponent("create-button", {
    init: function(){
        button1 = document.createElement("button");
        button1.innerHTML = "ORDER SUMMARY";
        button1.setAttribute("id", "summary-button");
        button1.setAttribute("class", "btn btn-danger");

        button2 = document.createElement("button");
        button2.innerHTML = "ORDER NOW";
        button2.setAttribute("id", "order-button");
        button2.setAttribute("class", "btn btn-danger");

        button_div = document.getElementById("button-div");
        button_div.appendChild(button1);
        button_div.appendChild(button2);
    }
});