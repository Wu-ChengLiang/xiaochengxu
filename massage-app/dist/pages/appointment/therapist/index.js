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
const taro = require("../../../taro.js");
const common = require("../../../common.js");
const index = "";
const TherapistSelectionPage = () => {
  const router = taro.taroExports.useRouter();
  const { storeId, selectedDate, selectedTime, from } = router.params;
  const [therapists, setTherapists] = taro.useState([]);
  const [store, setStore] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [error, setError] = taro.useState("");
  taro.useEffect(() => {
    loadData();
  }, [storeId]);
  const loadData = () => __async(exports, null, function* () {
    try {
      setLoading(true);
      setError("");
      const [therapistsRes, storeRes] = yield Promise.all(
        [
          common.therapistService.getTherapistsByStore(storeId),
          common.storeService.getStoreDetail(storeId)
        ]
      );
      setTherapists(therapistsRes.list);
      setStore(storeRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("加载数据失败，请重试");
    } finally {
      setLoading(false);
    }
  });
  const handleTherapistSelect = (therapist) => {
    const params = {
      therapistId: therapist.id,
      therapistName: therapist.name,
      storeId,
      storeName: (store == null ? void 0 : store.name) || "",
      selectedDate: selectedDate || "",
      selectedTime: selectedTime || ""
    };
    taro.Taro.navigateTo({
      url: `/pages/appointment/symptom/index?${Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")}`
    });
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-booking-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "loading", children: "加载中..." }) });
  }
  if (error || !store) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-selection-page", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "error", children: error || "数据加载失败" }) });
  }
  return /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-selection-page", children: /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "main-content", scrollY: true, children: [
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "store-header", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "store-name", children: store.name }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "selected-time", children: selectedDate && selectedTime ? `${selectedDate} ${selectedTime}` : "请选择推拿师" })
    ] }),
    /* @__PURE__ */ taro.jsx(taro.View, { className: "therapists-list", children: therapists.map(
      (therapist) => /* @__PURE__ */ taro.jsxs(
        taro.View,
        {
          className: "therapist-card",
          onClick: () => handleTherapistSelect(therapist),
          children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "therapist-avatar", children: /* @__PURE__ */ taro.jsx(taro.Image, { src: therapist.avatar, mode: "aspectFill" }) }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "therapist-info", children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "name-rating", children: [
                /* @__PURE__ */ taro.jsx(taro.Text, { className: "name", children: therapist.name }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: "rating", children: [
                  /* @__PURE__ */ taro.jsxs(taro.Text, { className: "rating-score", children: [
                    "⭐ ",
                    therapist.rating
                  ] }),
                  /* @__PURE__ */ taro.jsxs(taro.Text, { className: "rating-count", children: [
                    "(",
                    therapist.ratingCount,
                    ")"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "expertise", children: therapist.expertise.map(
                (skill, index2) => /* @__PURE__ */ taro.jsx(taro.Text, { className: "skill-tag", children: skill }, index2)
              ) }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "experience", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "years", children: [
                  therapist.yearsOfExperience,
                  "年经验"
                ] }),
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "service-count", children: [
                  "已服务",
                  therapist.serviceCount,
                  "人"
                ] }),
                /* @__PURE__ */ taro.jsxs(taro.View, { className: `status ${therapist.status}`, children: [
                  therapist.status === "available" && "可预约",
                  therapist.status === "busy" && "繁忙",
                  therapist.status === "rest" && "休息"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "arrow", children: "→" })
          ]
        },
        therapist.id
      )
    ) })
  ] }) });
};
var config = {
  "navigationBarTitleText": "选择推拿师"
};
Page(taro.createPageConfig(TherapistSelectionPage, "pages/appointment/therapist/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
