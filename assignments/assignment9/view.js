const previewStock = [
  {
    "brandname": "A.K.O.O Clothing",
    "price": "200",
    "pic": "top1.jpg",
    "stock": 12
  },
  {
    "brandname": "B.K.T Clothing",
    "price": "500",
    "pic": "top2.jpg",
    "stock": 13
  },
  {
    "brandname": "R.O.V. Clothing",
    "price": "700",
    "pic": "top3.jpg",
    "stock": 50
  },
  {
    "brandname": "C.O.M Clothing",
    "price": "800",
    "pic": "top4.jpg",
    "stock": 22
  },
  {
    "brandname": "W.W.E Clothing",
    "price": "100",
    "pic": "top5.jpg",
    "stock": 55
  },
  {
    "brandname": "C.E.N Clothing",
    "price": "600",
    "pic": "top6.jpg",
    "stock": 87
  },
  {
    "brandname": "S.E.R Clothing",
    "price": "1000",
    "pic": "top7.jpg",
    "stock": 12
  },
  {
    "brandname": "V.A.R Clothing",
    "price": "1200",
    "pic": "top8.jpg",
    "stock": 29
  },
  {
    "brandname": "J.O.K.ES Clothing",
    "price": "550",
    "pic": "top9.jpg",
    "stock": 10
  }
]
;
(location.protocol === 'file:' ? Promise.resolve({ok:true,json:function(){return Promise.resolve(previewStock);}}) : fetch('new_cloth.json')).then(function(response) { if (!response.ok) throw new Error('Load failed'); return response.json(); }).then(function(items) {
    const container = document.getElementById('stock');
    items.forEach(function(item) {
        const card = document.createElement('article'); card.className = 'stock-card';
        const title = document.createElement('h2'); title.textContent = item.brandname || item.brand || item.name || 'Clothing';
        const price = document.createElement('p'); price.textContent = 'Price: ' + item.price;
        const stock = document.createElement('p'); stock.textContent = 'Stock: ' + item.stock;
        card.append(title, price, stock); container.appendChild(card);
    });
    document.getElementById('status').textContent = items.length + ' items';
}).catch(function() { document.getElementById('status').textContent = 'โหลดข้อมูลไม่สำเร็จ'; });
