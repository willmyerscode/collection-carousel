class wmCollectionCarousel {
  static get defaultSettings() {
    const freeMode = false;
    return {
      layout: "full-width", // header-adapt or folder
      fullWidth: false,
      cacheCollections: false,
      cacheDuration: 0, // minutes
      clickthrough: true,
      image: true,
      price: true,
      eventDates: true,
      title: true,
      excerpt: true,
      categories: true,
      tags: true,
      metadataAboveTitle: [],
      metadataBelowTitle: [],
      metadataBottom: [],
      contentOrder: [
        "metadataAboveTitle",
        "title",
        "metadataBelowTitle",
        "price",
        "eventDates",
        "excerpt",
        "metadataBottom",
      ],
      slidesPerView: "auto",
      slidesPerGroup: 1,
      spaceBetween: 30,
      loop: false,
      freeMode: freeMode,
      mousewheel: freeMode,
      centeredSlides: false,
      aspectRatio: "auto",
      autoplay: false,
      autoplayDelay: 3000,
      autoplayDisableOnInteraction: false,
      navigation: true,
      pagination: true,
      paginationType: "bullets",
      slidesPerViewSm: 1,
      slidesPerViewMd: 2,
      slidesPerViewLg: 4,
      slidesPerGroupSm: 1,
      slidesPerGroupMd: 1,
      slidesPerGroupLg: 1,
      spaceBetweenSm: 17,
      spaceBetweenMd: 34,
      spaceBetweenLg: 34,
      events: "upcoming",
      eventDateFormat: {
        showYear: true,
        timeFormat: "12", // '12' or '24'
        locale: "default",
        options: {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        },
      },
    };
  }
  static getSwiperConfig(settings) {
    // Helper function to handle slide width settings
    const handleSlideWidth = value => {
      if (settings.fullWidth && value === 1) {
        return {
          slidesPerView: "auto",
          width: `calc(100% - ${settings.slidesOffsetBefore}px - ${settings.slidesOffsetAfter}px)`,
        };
      }

      if (
        typeof value === "string" &&
        value.match(/\d+(\.\d+)?(px|rem|em|vw|%)/)
      ) {
        return {
          slidesPerView: "auto",
          width: value,
        };
      }
      return {
        slidesPerView: parseFloat(value),
        width: null,
      };
    };

    // Process all breakpoint values
    let mainView = handleSlideWidth(settings.slidesPerView);
    let smView = handleSlideWidth(
      settings.slidesPerViewSm || settings.slidesPerView
    );
    let mdView = handleSlideWidth(
      settings.slidesPerViewMd || settings.slidesPerView
    );
    let lgView = handleSlideWidth(
      settings.slidesPerViewLg || settings.slidesPerView
    );

    // Create resize handler
    const updateSwiperOffsets = swiper => {

      if (!swiper || !settings.fullWidth) return;
      let tempBlockWidth = 0;
      if (swiper.el.closest(".fluid-engine")) {
        const fluidEngine = swiper.el.closest(".fluid-engine");
        const tempBlock = document.createElement("div");
        tempBlock.className = "temp-block";
        tempBlock.style.opacity = 0;
        tempBlock.style.visibility = "hidden";
        tempBlock.style.gridArea = "1 / 2 / 2 / -2";
        fluidEngine.appendChild(tempBlock);

        tempBlockWidth = tempBlock.offsetWidth;
      }

      const offset = (window.innerWidth - tempBlockWidth) / 2;

      settings.slidesOffsetBefore = offset;
      swiper.params.slidesOffsetBefore = offset;
      settings.slidesOffsetAfter = offset;
      swiper.params.slidesOffsetAfter = offset;
      swiper.update();
    };

    const updateSlideWidths = swiper => {
      if (!swiper) return;

      mainView = handleSlideWidth(settings.slidesPerView);
      smView = handleSlideWidth(
        settings.slidesPerViewSm || settings.slidesPerView
      );
      mdView = handleSlideWidth(
        settings.slidesPerViewMd || settings.slidesPerView
      );
      lgView = handleSlideWidth(
        settings.slidesPerViewLg || settings.slidesPerView
      );

      const width = window.innerWidth;
      let currentView;

      if (width >= 1024) {
        currentView = lgView;
      } else if (width >= 768) {
        currentView = mdView;
      } else {
        currentView = smView;
      }

      if (currentView.width) {
        swiper.slides.forEach(slide => {
          slide.style.maxWidth = currentView.width;
        });
      } else {
        swiper.slides.forEach(slide => {
          slide.style.width = "";
        });
      }
      swiper.update();
    };

    return {
      slidesPerView: mainView.slidesPerView,
      slidesPerGroup: parseInt(settings.slidesPerGroup || 1),
      spaceBetween: parseInt(settings.spaceBetween),
      slidesOffsetBefore: 0,
      loop: settings.loop,
      centeredSlides: settings.centeredSlides,
      touchEventsTarget: "container",
      freeMode: {
        enabled: settings.freeMode,
        sticky: false,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      mousewheel: {
        enabled: settings.mousewheel,
        forceToAxis: true,
      },
      autoplay: settings.autoplay
        ? {
            delay: parseInt(settings.autoplay),
            disableOnInteraction: settings.autoplayDisableOnInteraction,
          }
        : false,
      navigation: {
        enabled: settings.navigation,
        nextEl: ".navigation-button-next",
        prevEl: ".navigation-button-prev",
      },
      pagination: {
        enabled: settings.pagination,
        el: ".collection-carousel-pagination .pagination-wrapper",
        clickable: true,
        type: settings.paginationType,
      },
      breakpoints: {
        0: {
          slidesPerView: smView.slidesPerView,
          spaceBetween: parseInt(
            settings.spaceBetweenSm || settings.spaceBetween
          ),
          slidesPerGroup: parseInt(
            settings.slidesPerGroupSm || settings.slidesPerGroup
          ),
        },
        768: {
          slidesPerView: mdView.slidesPerView,
          spaceBetween: parseInt(
            settings.spaceBetweenMd || settings.spaceBetween
          ),
          slidesPerGroup: parseInt(
            settings.slidesPerGroupMd || settings.slidesPerGroup
          ),
        },
        1024: {
          slidesPerView: lgView.slidesPerView,
          spaceBetween: parseInt(
            settings.spaceBetweenLg || settings.spaceBetween
          ),
          slidesPerGroup: parseInt(
            settings.slidesPerGroupLg || settings.slidesPerGroup
          ),
        },
      },
      on: {
        scroll: function (swiper, event) {},
        touchStart: function (swiper, event) {},
        init: function (swiper) {
          updateSwiperOffsets(swiper);
          updateSlideWidths(swiper);
          window.addEventListener("resize", () => {
            updateSwiperOffsets(swiper);
            updateSlideWidths(swiper);
          });
        },
      },
    };
  }
  static get userSettings() {
    return window["wmCollectionCarouselSettings"] || {};
  }
  static instanceSettings(el) {
    const dataAttributes = {};

    if (el.dataset.freeMode && !el.dataset.mousewheel) {
      el.dataset.mousewheel = el.dataset.freeMode;
    }
    if (!el.dataset.fullWidth) {
      el.offsetWidth === window.innerWidth
        ? (el.dataset.fullWidth = true)
        : (el.dataset.fullWidth = false);
    }

    function parseAttr(string) {
      if (string === "true") return true;
      if (string === "false") return false;
      const number = parseFloat(string);
      if (!isNaN(number) && number.toString() === string) return number;
      return string;
    }

    // Function to set value in a nested object based on key path
    const setNestedProperty = (obj, keyPath, value) => {
      const keys = keyPath.split("__");
      let current = obj;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = parseAttr(value);
        } else {
          current = current[key] = current[key] || {};
        }
      });
    };

    for (let [attrName, value] of Object.entries(el.dataset)) {
      setNestedProperty(dataAttributes, attrName, value);
    }

    if (dataAttributes.metadataBottom) {
      dataAttributes.metadataBottom = dataAttributes.metadataBottom
        .split(",")
        .map(item => item.trim().toLowerCase());
    }
    if (dataAttributes.metadataAboveTitle) {
      dataAttributes.metadataAboveTitle = dataAttributes.metadataAboveTitle
        .split(",")
        .map(item => item.trim().toLowerCase());
    }
    if (dataAttributes.metadataBelowTitle) {
      dataAttributes.metadataBelowTitle = dataAttributes.metadataBelowTitle
        .split(",")
        .map(item => item.trim().toLowerCase());
    }

    return dataAttributes;
  }
  constructor(el) {
    this.el = el;
    this.settings = wmCollectionCarousel.deepMerge(
      {},
      wmCollectionCarousel.defaultSettings,
      wmCollectionCarousel.userSettings,
      wmCollectionCarousel.instanceSettings(el)
    );

    this.init();
  }
  async init() {
    const self = this;
    wmCollectionCarousel.emitEvent("wmCollectionCarousel:beforeInit", self);
    const {items, type} = await this.getCollectionData();
    if (items.length <= 0) {
      console.error("No Items In Collection or Collection URL not available");
      return;
    }
    this.type = type;
    this.items = items;

    this.buildStructure();
    this.swiper = new Swiper(
      this.el,
      wmCollectionCarousel.getSwiperConfig(this.settings)
    );
    wmCollectionCarousel.emitEvent("wmCollectionCarousel:ready", self);
  }
  build() {
    return {
      tags: item => {
        if (!item?.tags?.length) return null;

        const tags = document.createElement("div");
        tags.className = "tags metadata";

        const tagList = document.createElement("ul");
        tagList.setAttribute("aria-label", "Tags");

        tagList.innerHTML = item.tags
          .map(
            tag => `
                <li>
                    <span class="tag" rel="tag">${tag}</span>
                </li>
            `
          )
          .join("");

        tags.appendChild(tagList);
        return tags;
      },
      categories: item => {
        if (!item?.categories?.length && !item?.categoriesFull?.length)
          return null;

        const categories = document.createElement("div");
        categories.className = "categories metadata";

        const categoryList = document.createElement("ul");
        categoryList.setAttribute("aria-label", "Categories");

        if (item.categories?.length) {
          categoryList.innerHTML = item.categories
            .map(
              category => `
              <li>
                <span class="category" rel="category">${category}</span>
              </li>
            `
            )
            .join("");
        } else if (item.categoriesFull?.length) {
          categoryList.innerHTML = item.categoriesFull
            .map(
              category => `
              <li>
                <span class="category" rel="category">${category.displayName}</span>
              </li>
            `
            )
            .join("");
        }

        categories.appendChild(categoryList);
        return categories;
      },
      publisheddate: item => {
        if (!item?.publishOn) return null;
        const date = document.createElement("div");
        date.className = "published-on metadata";

        // Format the date using the same options as event dates
        const publishDate = new Date(item.publishOn);
        const dateFormat = this.settings.eventDateFormat;
        const options = {
          ...dateFormat.options,
          year: dateFormat.showYear ? "numeric" : undefined,
          // Remove time-specific options since they're not typically needed for publish dates
          hour: undefined,
          minute: undefined,
        };

        date.innerHTML = publishDate.toLocaleString(dateFormat.locale, options);
        return date;
      },
      publishdate: function (item) {
        return this.publisheddate(item);
      },
      author: item => {
        if (!item?.author) return null;
        const author = document.createElement("div");
        author.className = "author metadata";
        author.innerHTML = item.author?.displayName;
        return author;
      },
      price: item => {
        if (this.type !== "products") return null;
        let price = document.createElement("p");
        price.className = "price";

        // Currency symbol mapping
        const currencyMap = {
          USD: "$",
          CAD: "CA$",
          GBP: "£",
          AUD: "A$",
          EUR: "€",
          CHF: "CHF",
          NOK: "kr",
          SEK: "kr",
          DKK: "kr",
          NZD: "NZ$",
          SGD: "S$",
          MXN: "$",
          HKD: "HK$",
          CZK: "Kč",
          ILS: "₪",
          MYR: "RM",
          RUB: "₽",
          PHP: "₱",
          PLN: "zł",
          THB: "฿",
          BRL: "R$",
          ARS: "$",
          COP: "$",
          IDR: "Rp",
          INR: "₹",
          JPY: "¥",
          ZAR: "R",
        };

        // Get variants array and check if it exists and has items
        const variants = item.variants || [];
        if (variants.length > 0) {
          const firstVariant = variants[0];
          const basePrice = firstVariant.priceMoney?.value;
          const salePrice = firstVariant.salePriceMoney?.value;
          const currency = firstVariant.priceMoney?.currency || "USD";
          const isOnSale = firstVariant.onSale;

          // Add "from" if there are multiple variants
          const pricePrefix = variants.length > 1 ? "from " : "";
          const currencySymbol = currencyMap[currency] || "$";

          if (isOnSale && salePrice) {
            price.innerHTML = `
              <span class="original-price" style="text-decoration: line-through">${pricePrefix}${currencySymbol}${basePrice}</span>
              <span class="sale-price">${currencySymbol}${salePrice}</span>
            `;
          } else {
            price.innerHTML = basePrice
              ? `${pricePrefix}${currencySymbol}${basePrice}`
              : "";
          }
        }
        return price;
      },
      eventDates: item => {
        if (!item?.structuredContent?.startDate) return null;
        const eventDates = document.createElement("div");
        const eventDatesContent = document.createElement("p");
        eventDatesContent.className = "event-dates";
        eventDates.appendChild(eventDatesContent);

        const startDate = new Date(item.structuredContent?.startDate);
        const endDate = new Date(item.structuredContent?.endDate);

        const dateFormat = this.settings.eventDateFormat;
        const options = {
          ...dateFormat.options,
          year: dateFormat.showYear ? "numeric" : undefined,
          hour12: dateFormat.timeFormat === "12",
        };

        const formatDate = (date, includeDate = true) => {
          if (includeDate) {
            return date.toLocaleString(dateFormat.locale, options);
          } else {
            return date.toLocaleString(dateFormat.locale, {
              hour: options.hour,
              minute: options.minute,
              hour12: options.hour12,
            });
          }
        };

        const sameDay = startDate.toDateString() === endDate.toDateString();
        const dateString = sameDay
          ? `${formatDate(startDate)} - ${formatDate(endDate, false)}`
          : `${formatDate(startDate)} - ${formatDate(endDate)}`;

        eventDatesContent.innerHTML = dateString;
        return eventDates;
      },
    };
  }
  buildStructure() {
    // Create main swiper container
    const swiperContainer = this.el;
    swiperContainer.className = "swiper collection-carousel";

    // Create wrapper for slides
    const swiperWrapper = document.createElement("div");
    this.swiperWrapper = swiperWrapper;
    swiperWrapper.className = "swiper-wrapper";

    /* If type is event, only add events with item.upcoming set to true */
    if (this.type === "event" && this.settings.events === "upcoming") {
      this.items = this.items.filter(item => item.upcoming);
    } else if (this.type === "event" && this.settings.events === "past") {
      this.items = this.items.filter(item => !item.upcoming);
    }

    const builders = this.build();

    // Create slides for each item
    this.items.forEach(item => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide collection-carousel-slide";

      // Create image container with focal point support
      let imageContainer;
      if (this.settings.image) {
        imageContainer = document.createElement("div");
        imageContainer.className = "slide-image";
        imageContainer.style.position = "relative";
        imageContainer.style.overflow = "hidden";
        if (this.settings.aspectRatio) {
          imageContainer.classList.add("aspect-ratio");
          imageContainer.style.aspectRatio = this.settings.aspectRatio;
        }

        const image = document.createElement("img");
        image.src = item.assetUrl;
        image.alt = item.title;
        if (item.mediaFocalPoint) {
          image.style.objectPosition = `${item.mediaFocalPoint.x * 100}% ${
            item.mediaFocalPoint.y * 100
          }%`;
        }

        image.style.objectFit = "cover";
        imageContainer.appendChild(image);
        // Wrap image in link if clickthrough is enabled
        if (this.settings.clickthrough) {
          const imageLink = document.createElement("a");
          imageLink.className = "slide-image-link";
          imageLink.href = item.fullUrl;
          imageContainer.appendChild(image);
          imageContainer.appendChild(imageLink);
        } else {
          imageContainer.appendChild(image);
        }
      }

      // Create content container
      const content = document.createElement("div");
      content.className = "slide-content";

      let title;
      let excerpt;
      let price;
      let eventDates;
      let metadataAboveTitle;
      let metadataBelowTitle;
      let metadataBottom;

      // Add title with conditional link
      if (this.settings.title) {
        title = document.createElement("div");
        title.className = "content-title";
        const titleContent = document.createElement("h3");
        if (this.settings.clickthrough) {
          const titleLink = document.createElement("a");
          titleLink.href = item.fullUrl;
          titleLink.innerHTML = item.title;
          titleContent.appendChild(titleLink);
        } else {
          titleContent.innerHTML = item.title;
        }
        title.appendChild(titleContent);
      }

      if (this.settings.price && this.type === "products") {
        price = document.createElement("div");
        price.className = "content-price";
        price.append(builders.price(item));
      }

      if (this.settings.eventDates && this.type === "event") {
        eventDates = builders.eventDates(item);
        // eventDates = document.createElement("div");
        eventDates.className = "content-event-dates";
      }

      // Add excerpt if exists
      if (this.settings.excerpt && item.excerpt) {
        excerpt = document.createElement("div");
        excerpt.className = "content-excerpt";
        excerpt.innerHTML = item.excerpt;
      }

      if (this.settings.metadataAboveTitle.length) {
        metadataAboveTitle = document.createElement("div");
        metadataAboveTitle.className = "content-metadata-above-title metadata";
        this.settings.metadataAboveTitle.forEach(metadata => {
          if (builders[metadata]) {
            const element = builders[metadata](item);
            if (element) {
              metadataAboveTitle.appendChild(element);
            }
          }
        });
      }
      if (this.settings.metadataBelowTitle.length) {
        metadataBelowTitle = document.createElement("div");
        metadataBelowTitle.className = "content-metadata-below-title metadata";
        this.settings.metadataBelowTitle.forEach(metadata => {
          if (builders[metadata]) {
            const element = builders[metadata](item);
            if (element) {
              metadataBelowTitle.appendChild(element);
            }
          }
        });
      }
      if (this.settings.metadataBottom.length) {
        metadataBottom = document.createElement("div");
        metadataBottom.className = "content-metadata-bottom metadata";
        this.settings.metadataBottom.forEach(metadata => {
          if (builders[metadata]) {
            const element = builders[metadata](item);
            if (element) {
              metadataBottom.appendChild(element);
            }
          }
        });
      }

      if (this.settings.image) slide.appendChild(imageContainer);

      /* Add content based on the contentOrder array */
      this.settings.contentOrder.forEach(contentPiece => {
        if (contentPiece === "title" && title) content.appendChild(title);
        if (contentPiece === "price" && price) content.appendChild(price);
        if (contentPiece === "eventDates" && eventDates)
          content.appendChild(eventDates);
        if (contentPiece === "excerpt" && excerpt) content.appendChild(excerpt);
        if (contentPiece === "metadataAboveTitle" && metadataAboveTitle)
          content.appendChild(metadataAboveTitle);
        if (contentPiece === "metadataBelowTitle" && metadataBelowTitle)
          content.appendChild(metadataBelowTitle);
        if (contentPiece === "metadataBottom" && metadataBottom)
          content.appendChild(metadataBottom);
      });

      slide.appendChild(content);
      swiperWrapper.appendChild(slide);
    });

    // Add navigation elements
    if (this.settings.navigation) {
      const navigationWrapper = document.createElement("div");
      this.navigationWrapper = navigationWrapper;
      navigationWrapper.className = "navigation-wrapper";

      const prevButtonWrapper = document.createElement("div");
      const nextButtonWrapper = document.createElement("div");
      nextButtonWrapper.className = "navigation-button-next";
      prevButtonWrapper.className = "navigation-button-prev";

      const prevButton = document.createElement("button");
      this.prevButton = prevButton;
      prevButton.innerHTML = `<div class="swiper-button-background"></div>
              <svg class="user-items-list-carousel__arrow-icon" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
                <path class="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116"></path>
                <path class="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M42.8633 9.18125L3.37868 9.18125"></path>
              </svg>`;
      prevButtonWrapper.appendChild(prevButton);

      const nextButton = document.createElement("button");
      this.nextButton = nextButton;
      nextButton.innerHTML = `<div class="swiper-button-background"></div>
              <svg class="user-items-list-carousel__arrow-icon" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
                <path class="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M34.1477 1.39111L41.9321 9.17551L34.1477 16.9599"></path>
                <path class="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M1.19088 9.16982H40.6755"></path>
              </svg>`;
      nextButtonWrapper.appendChild(nextButton);

      navigationWrapper.appendChild(prevButtonWrapper);
      navigationWrapper.appendChild(nextButtonWrapper);
    }

    if (this.settings.pagination) {
      const pagination = document.createElement("div");
      this.pagination = pagination;
      pagination.className = "collection-carousel-pagination";

      const paginationWrapper = document.createElement("div");
      paginationWrapper.className = "pagination-wrapper";

      pagination.appendChild(paginationWrapper);
    }

    // Assemble final structure
    swiperContainer.appendChild(swiperWrapper);
    if (this.settings.navigation) {
      swiperContainer.appendChild(this.navigationWrapper);
    }
    if (this.settings.pagination) {
      swiperContainer.appendChild(this.pagination);
    }
  }

  async getCollectionData() {
    const sourceUrl = this.el.dataset.source;
    if (!sourceUrl) return;
    const items = [];
    let collection = null;
    let website = null;
    let type = null;

    const typeMap = {
      portfolio: "portfolio",
      products: "products",
      blog: "blog",
      event: "event",
      lessons: "video",
      course: "course",
    };

    const determineCollectionType = typeLabel => {
      for (const key in typeMap) {
        if (typeLabel.includes(key)) return typeMap[key];
      }
      return null;
    };

    const getCacheKey = source => {
      return `wmPlugins.${source.replace(/[^a-zA-Z0-9]/g, "_")}`;
    };

    const getCacheMetaKey = cacheKey => {
      return `${cacheKey}_meta`;
    };

    const isCacheValid = metaKey => {
      const meta = localStorage.getItem(metaKey);
      if (!meta) return false;

      const {timestamp} = JSON.parse(meta);
      const now = new Date().getTime();
      const cacheAge = (now - timestamp) / (1000 * 60); // Convert to minutes
      return cacheAge < this.settings.cacheDuration;
    };

    const getData = async path => {
      try {
        const cacheBustedPath = path.includes("?")
          ? `${path}&cb=${Date.now()}`
          : `${path}?cb=${Date.now()}`;

        const response = await fetch(cacheBustedPath);
        if (!response.ok)
          throw new Error(`Fetch error: ${response.statusText}`);
        const json = await response.json();

        let currentItems = json.items;
        collection = json.collection;
        website = json.website;
        type = determineCollectionType(collection.typeLabel);

        if (type === "event") {
          const upcoming = json.upcoming.map(item => ({
            ...item,
            upcoming: true,
          }));
          const past = json.past.map(item => ({...item, upcoming: false}));
          currentItems = [...upcoming, ...past];
        }

        if (type === "products") {
          const nestedCategories = json.nestedCategories;
          if (nestedCategories) {
            currentItems.forEach(item => {
              item.categoriesFull = item.categoryIds
                .map(categoryId => {
                  const category = nestedCategories.categories.find(
                    cat => cat.id === categoryId
                  );
                  return category || null;
                })
                .filter(category => category);
            });
          }
        }

        items.push(...currentItems);

        if (json.pagination?.nextPage) {
          await getData(
            json.pagination.nextPageUrl + "&format=json&cb=" + Date.now()
          );
        }
        return {items, type};
      } catch (error) {
        console.error("Fetch operation failed:", error);
        throw error;
      }
    };

    try {
      const cacheKey = getCacheKey(sourceUrl);
      const cacheMetaKey = getCacheMetaKey(cacheKey);

      // Check cache if duration is set
      if (this.settings.cacheDuration > 0) {
        const cached = localStorage.getItem(cacheKey);
        if (cached && isCacheValid(cacheMetaKey)) {
          console.log("Cache is valid, returning cached data");
          return JSON.parse(cached);
        }
      }

      // Fetch fresh data
      const freshData = await getData(sourceUrl + "?format=json");

      // Save to cache if duration is set
      if (this.settings.cacheDuration > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(freshData));
        localStorage.setItem(
          cacheMetaKey,
          JSON.stringify({
            timestamp: new Date().getTime(),
          })
        );
      }

      return freshData;
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  }
  static deepMerge(...objs) {
    function getType(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    function mergeObj(clone, obj) {
      for (let [key, value] of Object.entries(obj)) {
        let type = getType(value);
        if (type === "object" || type === "array") {
          if (clone[key] === undefined) {
            clone[key] = type === "object" ? {} : [];
          }
          mergeObj(clone[key], value);
        } else if (type === "function") {
          clone[key] = value;
        } else {
          clone[key] = value;
        }
      }
    }
    if (objs.length === 0) {
      return {};
    }
    let clone = {};
    objs.forEach(obj => {
      mergeObj(clone, obj);
    });
    return clone;
  }
  static emitEvent(type, detail = {}, elem = document) {
    if (!type) return;
    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    });
    return elem.dispatchEvent(event);
  }
}

(() => {
  function initCollectionCarousel() {
    const els = document.querySelectorAll(
      '[data-wm-plugin="collection-carousel"]:not([data-loading])'
    );
    if (!els.length) return;
    els.forEach(el => {
      el.dataset.loading = "loading";
      new wmCollectionCarousel(el);
    });
  }
  window.wmCollectionCarousel = {
    init: () => initCollectionCarousel(),
  };
  window.wmCollectionCarousel.init();
  window.addEventListener("DOMContentLoaded", initCollectionCarousel);
})();
