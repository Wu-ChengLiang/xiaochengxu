"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("../../taro.js");
const vendors = require("../../vendors.js");
const common = require("../../common.js");
const index$3 = "";
const StoreCard = ({ store, onClick }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "normal":
        return "就近";
      case "busy":
        return "繁忙";
      case "full":
        return "爆满";
      default:
        return "";
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "normal":
        return "status-normal";
      case "busy":
        return "status-busy";
      case "full":
        return "status-full";
      default:
        return "";
    }
  };
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "store-card", onClick, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
    /* @__PURE__ */ taro.jsx(taro.View, { className: "store-image-wrapper", children: /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "store-image",
        src: common.normalizeImageUrl(store.image),
        mode: "aspectFill"
      }
    ) }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-info", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "business-hours", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "hours-text", children: store.businessHours }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: `status ${getStatusClass(store.status)}`, children: getStatusText(store.status) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "store-address", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "address-text", numberOfLines: 1, children: store.address }) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-footer", children: [
        store.distance !== void 0 && store.distance !== null && /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance", children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "map-pin", size: "12", color: "#999" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance-text", children: [
            store.distance,
            "km"
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(
          common.BookingButton,
          {
            size: "small"
          }
        )
      ] })
    ] })
  ] }) });
};
const index$2 = "";
const TherapistCard = ({ therapist, onClick }) => {
  const [reviewStats, setReviewStats] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  taro.useEffect(() => {
    const loadReviewStats = () => __async(exports, null, function* () {
      try {
        const stats = yield common.reviewService.getReviewStats(therapist.id);
        setReviewStats(stats);
      } catch (error) {
        console.error("获取推拿师评价统计失败:", error);
        setReviewStats(null);
      } finally {
        setLoading(false);
      }
    });
    loadReviewStats();
  }, [therapist.id]);
  const getRatingDisplay = () => {
    if (loading)
      return "...";
    if (!reviewStats || reviewStats.totalCount === 0)
      return "待评价";
    return `${reviewStats.averageRating}分`;
  };
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-card", onClick, children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "card-content", children: [
    /* @__PURE__ */ taro.jsx(
      taro.Image,
      {
        className: "therapist-avatar",
        src: therapist.avatar,
        mode: "aspectFill"
      }
    ),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "info-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "therapist-name", children: therapist.name }),
        therapist.distance !== void 0 && therapist.distance !== null && /* @__PURE__ */ taro.jsxs(taro.View, { className: "distance", children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "map-pin", size: "12", color: "#999" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "distance-text", children: [
            therapist.distance,
            "km"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "expertise-tags", children: therapist.expertise.map(
        (tag, index2) => /* @__PURE__ */ taro.jsx(taro.Text, { className: "expertise-tag", children: tag }, index2)
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-footer", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "rating", children: [
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "star-2", size: "12", color: "#faad14" }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-text", children: getRatingDisplay() })
        ] }),
        /* @__PURE__ */ taro.jsx(
          common.BookingButton,
          {
            size: "small"
          }
        )
      ] })
    ] })
  ] }) });
};
const index$1 = "";
const BottomSheet = ({
  visible,
  title,
  onClose,
  children,
  height = "70%"
}) => {
  const [animating, setAnimating] = taro.useState(false);
  const [internalVisible, setInternalVisible] = taro.useState(false);
  taro.useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      setTimeout(() => setAnimating(true), 50);
    } else {
      setAnimating(false);
      setTimeout(() => setInternalVisible(false), 300);
    }
  }, [visible]);
  const handleMaskClick = () => {
    onClose();
  };
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  if (!internalVisible)
    return null;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-sheet", onClick: handleMaskClick, children: [
    /* @__PURE__ */ taro.jsx(
      taro.View,
      {
        className: `bottom-sheet-mask ${animating ? "active" : ""}`
      }
    ),
    /* @__PURE__ */ taro.jsxs(
      taro.View,
      {
        className: `bottom-sheet-content ${animating ? "active" : ""}`,
        style: { height },
        onClick: handleContentClick,
        children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "sheet-header", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "sheet-title", children: title }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "close-btn", onClick: onClose, children: /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "close", size: "20", color: "#999" }) })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "sheet-body", children })
        ]
      }
    )
  ] });
};
const index = "";
const Appointment = () => {
  const [loading, setLoading] = taro.useState(true);
  const [stores, setStores] = taro.useState([]);
  const [allStores, setAllStores] = taro.useState([]);
  const [therapists, setTherapists] = taro.useState([]);
  const [showStoreSheet, setShowStoreSheet] = taro.useState(false);
  const [searchValue, setSearchValue] = taro.useState("");
  taro.useEffect(() => {
    loadData();
  }, []);
  const loadData = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      const location = yield common.getLocationService.getCurrentLocation();
      try {
        const nearbyStores = yield common.storeService.getNearbyStores(
          location.latitude,
          location.longitude,
          1,
          2
        );
        setStores(nearbyStores.list);
      } catch (error) {
        console.error("❌ 获取附近门店失败:", error);
        taro.Taro.showToast({
          title: "获取附近门店失败，请检查网络",
          icon: "none"
        });
        setStores([]);
      }
      try {
        const allStoresData = yield common.storeService.getNearbyStores(
          location.latitude,
          location.longitude,
          1,
          20
          // 获取更多数据
        );
        setAllStores(allStoresData.list);
      } catch (error) {
        console.error("❌ 获取所有门店失败:", error);
        setAllStores([]);
      }
      try {
        const recommendedTherapists = yield common.therapistService.getRecommendedTherapistsWithDistance(
          1,
          10
        );
        setTherapists(recommendedTherapists.list);
      } catch (error) {
        console.error("❌ 获取推荐推拿师失败:", error);
        taro.Taro.showToast({
          title: "获取推拿师列表失败，请检查网络",
          icon: "none"
        });
        setTherapists([]);
      }
    } catch (error) {
      console.error("❌ 加载页面数据失败:", error);
      taro.Taro.showToast({
        title: "页面加载失败，请刷新重试",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleStoreClick = (store) => {
    taro.Taro.navigateTo({
      url: `/pages/appointment/store/index?id=${store.id}`
    });
  };
  const handleTherapistClick = (therapist) => {
    taro.Taro.navigateTo({
      url: `/pages/appointment/therapist/index?therapistId=${therapist.id}&storeId=${therapist.storeId}`
    });
  };
  const handleMoreStores = () => {
    setShowStoreSheet(true);
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "appointment-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "stores-section", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "section-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "门店预约" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "more-link", onClick: handleMoreStores, children: [
          "更多门店",
          /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "chevron-right", size: "14", color: "#a40035" })
        ] })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "store-list", children: stores.map(
        (store) => /* @__PURE__ */ taro.jsx(
          StoreCard,
          {
            store,
            onClick: () => handleStoreClick(store)
          },
          store.id
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapists-section", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "section-header", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "推拿师预约" }) }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-list", children: therapists.map(
        (therapist) => /* @__PURE__ */ taro.jsx(
          TherapistCard,
          {
            therapist,
            onClick: () => handleTherapistClick(therapist)
          },
          therapist.id
        )
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(
      BottomSheet,
      {
        visible: showStoreSheet,
        title: "更多门店",
        onClose: () => setShowStoreSheet(false),
        height: "80%",
        children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-sheet-header", children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-selector", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-name", children: "上海市" }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-arrow", children: "▼" })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-box", children: [
              /* @__PURE__ */ taro.jsx(vendors.AtIcon, { value: "search", size: "16", color: "#999" }),
              /* @__PURE__ */ taro.jsx(
                taro.Input,
                {
                  className: "search-input",
                  placeholder: "搜索门店",
                  value: searchValue,
                  onInput: (e) => setSearchValue(e.detail.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "store-sheet-list", children: allStores.filter(
            (store) => searchValue === "" || store.name.includes(searchValue) || store.address.includes(searchValue)
          ).map(
            (store) => /* @__PURE__ */ taro.jsx(
              StoreCard,
              {
                store,
                onClick: () => {
                  handleStoreClick(store);
                  setShowStoreSheet(false);
                }
              },
              store.id
            )
          ) })
        ]
      }
    )
  ] });
};
var config = {
  "usingComponents": {
    "comp": "../../comp"
  }
};
Page(taro.createPageConfig(Appointment, "pages/appointment/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
