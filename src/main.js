function Product() {
  this.fetchData = async () => {
    try {
      const res = await fetch("https://dummyjson.com/products");

      if (res.status === 200 && res.ok === true) {
        const data = await res.json();
        return data.products;
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  this.getProduct = async () => {
    const products = await this.fetchData();
    return products;
  };

  this.container = document.querySelector("#product-wrapper");
  if (this.container) {
    this.startMain = () => {
      this.renderProduct();
      this.handleProduct();
    };

    this.createStructure = (imgSrc, name, fee, id) => {
      const productItem = document.createElement("div");
      productItem.className = "product-item";
      productItem.dataset.id = id;

      const coverImgWrapper = document.createElement("figure");
      coverImgWrapper.className = "cover-img";

      const coverImg = document.createElement("img");
      coverImg.alt = "cover-img";
      coverImg.src = imgSrc;

      const productNameWrapper = document.createElement("div");
      productNameWrapper.className = "product-name";

      const productName = document.createElement("p");
      productName.className = "name";
      productName.style.cursor = "pointer";

      productName.textContent = name;

      const productFee = document.createElement("div");
      productFee.className = "product-fee";
      productFee.textContent = `$${fee}`;

      const buyBtn = document.createElement("button");
      buyBtn.className = "buy-button";
      buyBtn.textContent = "Buy Now";

      coverImgWrapper.appendChild(coverImg);
      productNameWrapper.appendChild(productName);

      productItem.append(
        coverImgWrapper,
        productNameWrapper,
        productFee,
        buyBtn,
      );
      this.container.appendChild(productItem);
    };

    this.renderProduct = async () => {
      this.products = await this.getProduct();
      this.container.innerHTML = "";

      this.products.forEach((product) => {
        const imgSrc = product.thumbnail;
        const name = product.title;
        const fee = product.price;
        const id = product.id;
        this.createStructure(imgSrc, name, fee, id);
      });
    };

    this.handleProduct = async () => {
      await this.renderProduct();
      this.productElements = Array.from(this.container.children);
      this.productElements.forEach((element) => {
        element.onclick = (e) => {
          const id = +e.target.closest(".product-item").dataset.id;
          location.href = `./src/html/detail.html?id=${id}`;
        };
      });
    };

    this.startMain();
  }

  this.productDetailWrapper = document.querySelector("#product-detail-wrapper");
  if (this.productDetailWrapper) {
    const param = new URLSearchParams(location.search);
    const paramId = +param.get("id");

    this.startDetail = () => {
      this.renderDetail();
    };

    this.renderThumbnails = async () => {
      const products = await this.getProduct();

      const thumbnails = await products
        .map((product) => {
          if (paramId === product.id) {
            const productThumbnails = product.images.map((imgUrl) => {
              const html = DOMPurify.sanitize(`
                         <figure class="thumbnails__img">
                <img src="${imgUrl}" alt="" />
              </figure>`);
              return html;
            });
            return productThumbnails;
          }
        })
        .filter(Boolean)
        .join("");

      return thumbnails;
    };

    this.renderComment = async () => {
      const products = await this.getProduct();

      const reviewStructure = products
        .map((product) => {
          if (paramId === product.id) {
            const reviews = product.reviews
              .map((review) => {
                const html = DOMPurify.sanitize(`
                   <div class="user">
              <div class="user-assess">
                <div class="user-info">
                  <figure class="avatar">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="" />
                  </figure>
                  <div class="name-time">
                    <h3 class="name">${review.reviewerName}</h3>
                    <time class="time" datetime="">${new Date(
                      review.date,
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</time>
                  </div>
                </div>

                <div class="assess-point">
                  <span>${review.rating}</span>
                  <i class="fa-solid fa-star" style="color: #ffd43b"></i>
                </div>
              </div>

              <p class="user-cmt">
                ${review.comment}
              </p>
            </div>`);

                return html;
              })
              .join("");

            return reviews;
          }
        })
        .filter(Boolean)
        .join("");

      return reviewStructure;
    };

    this.renderTag = async () => {
      const products = await this.getProduct();
      const productTarget = products.find((product) => product.id === paramId);
      const tags = productTarget.tags
        .map((tag) => {
          const html = DOMPurify.sanitize(`
             <li>${tag}</li>`);

          return html;
        })
        .join("");

      return tags;
    };

    this.renderBarCode = async () => {
      const products = await this.getProduct();
      const productTarget = products.find((product) => product.id === paramId);

      JsBarcode("#barcode", `${productTarget.meta.barcode}`, {
        format: "CODE128",
        font: "OCR-B",
        fontSize: 18,
        displayValue: true,
      });
    };

    this.renderTimeCreate = async () => {
      const products = await this.getProduct();
      const productTarget = products.find((product) => product.id === paramId);

      const timeCreate = new Date(
        productTarget.meta.createdAt,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return timeCreate;
    };

    this.renderTimeUpdate = async () => {
      const products = await this.getProduct();
      const productTarget = products.find((product) => product.id === paramId);

      const timeUpdate = new Date(
        productTarget.meta.updatedAt,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return timeUpdate;
    };

    this.renderDetail = async () => {
      this.productDetailWrapper.innerHTML = "";
      const productDetail = await this.getProduct();

      const thumbnails = await this.renderThumbnails();

      const comments = await this.renderComment();

      const tags = await this.renderTag();

      const timeCreate = await this.renderTimeCreate();

      const timeUpdate = await this.renderTimeUpdate();

      const product = productDetail
        .map((product) => {
          if (product.id === paramId) {
            const html = DOMPurify.sanitize(`
         <div class="back">
          <a href="/">
            <i class="fa-solid fa-chevron-left"></i>
            Back
          </a>
        </div>
        <div class="product-detail">
          <div class="product-detail__img">
            <figure class="cover-img">
              <img src="${product.thumbnail}" alt="" />
            </figure>
            <div class="thumbnails thumbnails-${product.images.length}">
                ${thumbnails}
            </div>

            <section class="stock-status">
              <h2>Product Stock Status</h2>
              <p><em>${product.availabilityStatus}</em></p>
            </section>
          </div>
          <section class="product-detail__info">
            <div class="general-info">
              <p class="category">${product.category}</p>
              <h1 class="name-detail">${product.title}</h1>
              <div class="price-rating">
                <div class="total-price">
                  <strong class="price">$${product.price}</strong>
                  <div class="discount-card cart-sale"><strong>${
                    product.discountPercentage
                  }% OFF</strong></div>
                </div>

                <div class="rating">
                  <i class="fa-solid fa-star" style="color: #ffd43b"></i>
                  <strong>${product.rating}</strong>
                </div>
              </div>
            </div>

            <div class="divide"></div>

            <div class="more-detail">
              <section class="desc">
                <h2 class="desc__heading">Description</h2>
                <p class="desc__detail">
                
                </p>
              </section>
              <section class="in-stock">
                <h2 class="in-stock__heading">Available Status</h2>
                <p class="in-stock__info">${product.availabilityStatus}</p>
              </section>
              <section class="tags">
                <h2 class="tags__heading">tags</h2>
                <ul class="tags__item">
                 ${tags}
                </ul>
              </section>
              <section class="brand">
                <h2 class="brand__heading">Brand</h2>
                <p class="brand__info">${
                  product.brand ? product.brand : product.title
                }</p>
              </section>
              <section class="sku">
                <h2 class="sku__heading">SKU</h2>
                <p class="sku__info">${product.sku}</p>
              </section>
              <section class="weight">
                <h2 class="weight__heading">weight</h2>
                <p class="weight__metric">${product.weight} g</p>
              </section>
              <section class="dimension">
                <h2 class="dimension__heading">dimension</h2>
                <div class="dimension-metric">
                  <p class="dimension__width">${product.dimensions.width} mm</p>
                  <p class="dimension__height">${
                    product.dimensions.height
                  } mm</p>
                </div>
              </section>
              <section class="depth">
                <h2 class="depth__heading">depth</h2>
                <p class="depth__metric">${product.dimensions.depth} mm</p>
              </section>
              <section class="warranty-info">
                <h2 class="warranty-info__heading">warranty information</h2>
                <p class="warranty-info__info">${
                  product.warrantyInformation
                }</p>
              </section>
              <section class="shipping-info">
                <h2 class="shipping-info__heading">shipping information</h2>
                <p class="shipping-info__info">${
                  product.shippingInformation
                }</p>
              </section>
            </div>
            <div class="confirm-btn">
              <button class="btn cart-adding">Add to Cart</button>
              <button class="btn buy-now-btn">Buy Now</button>
            </div>
          </section>
        </div>
        <div class="divide"></div>
        <div class="policy-assess">
          <div class="assess">
            <h2 class="assess-heading">Assessment</h2>
            ${comments}
          </div>
          <div class="policy">
            <section class="return-policy">
              <h2>Return Policy</h2>
              <p>${product.returnPolicy}</p>
            </section>
            <section class="minimum-order">
              <h2>Minimum Order Quantity</h2>
              <p>${product.minimumOrderQuantity}</p>
            </section>
            <section class="policy-meta-data">
              <h2>Meta Data</h2>
              <div class="meta-time">
                <div class="create-at">
                  <p>Create At</p>
                  <time datetime="">${timeCreate}</time>
                </div>
                <div class="update-at">
                  <p>Update At</p>
                  <time datetime="">${timeUpdate}</time>
                </div>
              </div>
            </section>
            <div class="code">
              <figure class="qr-code">
                <img src="${product.meta.qrCode}" alt="" />
              </figure>
              <figure class="bar-code">
                <img style="width: 100%; height: 100%" id="barcode" src="" alt="" />
              </figure>
            </div>
          </div>
        </div>
    `);
            return html;
          }
        })
        .filter(Boolean)
        .join("");

      this.productDetailWrapper.innerHTML = product;

      this.renderBarCode();
    };

    this.startDetail();
  }
}

const ecommerce = new Product();
