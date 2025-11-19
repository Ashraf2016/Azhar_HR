// // src/pdf/fonts.js
// import { Font } from "@react-pdf/renderer";
// import NotoSansArabic from "../assets/fonts/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf";
// import Roboto from "../assets/fonts/Roboto-Regular.ttf";

// try {
//   Font.register({
//     family: "NotoSansArabic",
//     src: NotoSansArabic,
//     fontWeight: "normal",
//   });

//   Font.register({
//     family: "Roboto",
//     src: Roboto,
//     fontWeight: "normal",
//   });
// } catch (e) {
//   // في حال تم التسجيل مسبقًا، نتجنّب رمي الخطأ
//   // (عادة الأمر لن يحدث في وضع التطوير، بس احتياطي)
//   // console.warn("Fonts register skipped:", e);
// }

// src/pdf/fonts.js
import { Font } from "@react-pdf/renderer";
import NotoSansArabic from "../assets/fonts/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf";
import Roboto from "../assets/fonts/Roboto-Regular.ttf";

// تسجيل الخطوط
if (!Font.getRegisteredFontFamilies().includes("NotoSansArabic")) {
  Font.register({
    family: "NotoSansArabic",
    src: NotoSansArabic,
  });
}

if (!Font.getRegisteredFontFamilies().includes("Roboto")) {
  Font.register({
    family: "Roboto",
    src: Roboto,
  });
}
