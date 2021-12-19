// console.log('hello');
// console.log('123');

let orderData =[];
const orderList =document.querySelector(".js-orderList");

function init(){
    getOrderList();
    // renderC3();
}   
init();
function renderC3(){
  // C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
      type: "pie",
      columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
      ],
      colors:{
          "Louvre 雙人床架":"#DACBFF",
          "Antony 雙人床架":"#9D7FEA",
          "Anty 雙人床架": "#5434A7",
          "其他": "#301E5F",
      }
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