// console.log('hello');
// console.log('123');

let orderData =[];
const orderList =document.querySelector(".js-orderList");

function init(){
    getOrderList();
    renderC3();
}   
init();
function renderC3(){
  console.log(orderData)
  //物件資料蒐集
  let total ={};
  orderData.forEach(function(item){
    item.products.forEach(function(productItem){
      if(total[productItem.category] == undefined){
        total[productItem.category] = productItem.price * productItem.quantity;
      }else{
        total[productItem.category] += productItem.price * productItem.quantity;
      }
    })
  })
  console.log(total);
  //做出資料關聯
  let categoryAry= Object.keys(total);
  console.log(categoryAry)
  let newData =[];
  categoryAry.forEach(function(item){
    let ary =[];
    ary.push(item);
    ary.push(total[item]);
    newData.push(ary);
  })
  console.log(newData)
  // C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: newData,
  },
});
}
function getOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
        }
    })
    .then(function(response){
        // console.log(response.data);
    orderData = response.data.orders;
       let str ="";
    orderData.forEach(function(item){
      //組時間字串
      const timestamp =new Date(item.createdAt*1000);
      const orderTime = `${timestamp.getFullYear()}/${timestamp.getMonth()+1}/${timestamp.getDate()}`;
      // console.log(orderTime);
       //組產品字串
       let productStr ="";
       item.products.forEach(function(productItem){
           productStr+=`<p>${productItem.title}x${productItem.quantity}</p>`
       })
        //判斷訂單處理狀態
         let orderStatus ="";
         if(item.paid ==true){
            orderStatus ="已處理";
         }else{
            orderStatus ="未處理";
         }
         //組訂單字串
        str +=` <tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${orderTime}</td>
        <td class="orderStatus" >
          <a href="#" data-status="${item.paid}" class="js-orderStatus" data-id="${item.id}">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
        </td>
    </tr>`
    })
    orderList.innerHTML =str;
    renderC3();
    })
}

orderList.addEventListener(`click`,function(e){
    e.preventDefault();
    const targetClass =e.target.getAttribute("class")
    console.log(targetClass);
    let id = e.target.getAttribute("data-id");
    if(targetClass == "delSingleOrder-Btn js-orderDelete"){
      // alert("你點擊到刪除按鈕!");
      deleteOrderItem(id)
      return;
    }

    if(targetClass =="js-orderStatus"){
      // console.log(e.target.textContent);
      // console.log(e.target.getAttribute("data-status"));
      let status =e.target.getAttribute("data-status");
      
      changOrderStatus(status,id);
      // alert("你點擊到訂單狀態!");
      return;
    }
})
//至google搜尋axios.put語法
function changOrderStatus(status,id){
  console.log(status,id);
  let newSatus;
  if(status == true){
    newSatus = false;
  }else{
    newSatus =true
  }
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    "data": {
      "id": id,
      "paid": newSatus
    }
  },{
        headers:{
            'Authorization':token,
        }
    })
    .then(function(response){
      alert("修改訂單成功");
      getOrderList();

  })
}

function deleteOrderItem(id){
  // console.log(id);
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,{
        headers:{
            'Authorization':token,
        }
    })
    .then(function(response){
      alert("刪除該筆訂單成功!");
      getOrderList();
  })
}

//timestamp