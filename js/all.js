// console.log("hello!")
// console.log(api_path,token);

const productList =document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList =document.querySelector(".shoppingCartList")
let productData =[];
let cartData =[];
// let str =`<li class="productCard">
// <h4 class="productType">新品</h4>
// <img src="https://hexschool-api.s3.us-west-2.amazonaws.com/custom/dp6gW6u5hkUxxCuNi8RjbfgufygamNzdVHWb15lHZTxqZQs0gdDunQBS7F6M3MdegcQmKfLLoxHGgV3kYunUF37DNn6coPH6NqzZwRfhbsmEblpJQLqXLg4yCqUwP3IE.png" alt="">
// <a href="#" class="addCardBtn">加入購物車</a>
// <h3>Antony 雙人床架／雙人加大</h3>
// <del class="originPrice">NT$18,000</del>
// <p class="nowPrice">NT$12,000</p>
// </li>`;
// productList.innerHTML =str;

function init(){
    getProductList();
    getCartList()
}   
init();

//取得產品資料
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
        // console.log(response.data);
        productData = response.data.products;
        renderProductList();
    })
}

//渲染產品資料
//有兩處以上重複時可撰寫函式重複式
function combineProductListHTMLItem(item){
    return `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src=${item.images} alt="">
    <a href="#" class="addCardBtn" id="js-addCart" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
    <p class="nowPrice">NT$${toThousands(item.price)}</p>
    </li>`;
}

function renderProductList(){
    let str="";
    productData.forEach(function(item){
        str += combineProductListHTMLItem(item);
    })
    productList.innerHTML =str;
}

//監聽篩選類別按鈕
productSelect.addEventListener(`change`,function(e){
    // console.log(e.target.value);
    const category =e.target.value;
    if( category == "全部"){
        renderProductList();
        return;
    }
    let str ="";
    productData.forEach(function(item){
        //item.category為有幾筆資料跑幾次，同時等於選擇要顯示內容
        if(item.category == category){
            str += combineProductListHTMLItem(item);
        }
        
    })
    productList.innerHTML =str;
})

//監聽加入購物車按鈕
productList.addEventListener(`click`,function(e){
    e.preventDefault();
    // console.log(e.target.value)
    let addCartClass = e.target.getAttribute("id");
    if(addCartClass !== "js-addCart"){
        alert("不要點我")
    }
    //按鈕點選加入購物車值與購物車資料值ID相同時數量相加
    let productId =e.target.getAttribute("data-id")
    // console.log(productId)
    let numCheck =1;
    cartData.forEach(function(item){
        if(item.product.id === productId){
            numCheck = item.quantity+=1;
        }
        // console.log(numCheck)
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
            "productId": productId,
            "quantity": numCheck
          }
    })
    .then(function(response){
        // console.log(response)
        alert("加入購物車")
        getCartList()
    })
})


//取得購物車資料
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        // console.log(response.data);

        document.querySelector(".js-total").textContent =toThousands(response.data.finalTotal);
        cartData = response.data.carts;
        let str ="";
        cartData.forEach(function(item){
            str +=`<tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${toThousands(item.product.price)}</td>
            <td>${item.quantity}</td>
            <td>NT$${toThousands(item.product.price*item.quantity)}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>`
        })
        cartList.innerHTML =str;
    })
}

cartList.addEventListener(`click`,function(e){
    e.preventDefault();

    let cartId =e.target.getAttribute("data-id");
    if(cartId == null){
        alert("你點擊錯誤~")
        return;
    }
    // console.log(cartId)
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then(function(response){
        // console.log(response.data);
        alert("刪除單筆資料成功~");
        getCartList();
    })
})

const discardAllBtn =document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener(`click`,function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        // console.log(response.data);
        alert("刪除全部資料成功~");
        getCartList();
    })
    .catch(function(response){
        alert("購物車已清空，請勿重複點擊~");
    })
})


//取出訂單資料

const orderInfoBtn =document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener('click',function(e){
    e.preventDefault();
    console.log(cartData.length)
    if(cartData.length == 0){
        alert("請加入購物車")
        return
    }
    const customerName =document.querySelector("#customerName").value;
    const customerPhone =document.querySelector("#customerPhone").value;
    const customerEmail =document.querySelector("#customerEmail").value;
    const customerAddress =document.querySelector("#customerAddress").value;
    const customerTradeWay =document.querySelector("#tradeWay").value;
    // console.log(customerName,customerPhone,customerEmail,customerAddress,customerTradeWay)
    if(customerName =="" || customerPhone =="" || customerEmail =="" || customerAddress =="" || customerTradeWay ==""){
        alert("請輸入訂單資料~")
        return
    }axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
        "data": {
          "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
          }
        }
      })
    .then(function(response){
        // console.log(response.data);
        alert("訂單建立成功~");
        getCartList();
        document.querySelector("#customerName").value ="";
        document.querySelector("#customerPhone").value ="";
        document.querySelector("#customerEmail").value ="";
        document.querySelector("#customerAddress").value ="";
        document.querySelector("#tradeWay").value ="ATM";
    })
})

//util js
function toThousands(x){
    let parts =x.toString().split(".");
    parts[0] =parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    return parts.join(".");
}