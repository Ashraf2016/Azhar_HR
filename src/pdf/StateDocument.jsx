
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import Logo from "../assets/Logo.png";
// ✅ Register Arabic font using Google Fonts URL (this works better than local files)
Font.register({
  family: "NotoSansArabic",
  src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyvu3CBFQLaig.ttf",
});


console.log("StateDocument component is loaded!");


// 🔧 Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "NotoSansArabic",
    direction: "rtl",
    maxHeight: 842,
    maxWidth: 595,
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  // في Styles
  header: {
    flexDirection: "row-reverse", // ممتاز، يجعل اليمين أولاً
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 60,
    alignItems: "center", // ⬅️ تعديل: اجعليها متمركزة عمودياً
    fontWeight: "bold",
  },
  headerRight: {
    alignItems: "flex-end", // ⬅️ تعديل: النص العربي يمين
    flex: 1.2, // ⬅️ تعديل: أعطِها مساحة أكبر للنصوص الطويلة
    textAlign: "right",
  },
  headerLeft: {
    alignItems: "flex-start", // ⬅️ تعديل: النص الإنجليزي يسار
    flex: 1.2,
    textAlign: "left",
    fontFamily: "Helvetica",
  },
  headerCenter: {
    alignItems: "center",
    flex: 0.6, // ⬅️ تعديل: مساحة أقل للشعار
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  arabicText: {
    fontSize: 10,
    color: "#1F2937",
    marginBottom: 1,
    textAlign: "right",
    fontFamily: "NotoSansArabic",
    fontWeight: "bold",
  },
  englishText: {
    fontSize: 10,
    color: "#1F2937",
    marginBottom: 3,
    fontFamily: "Helvetica",
  },
  section: {
    padding: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  employeeInfo: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "30%", // 4 columns
    flexDirection: "row-reverse", // For Arabic
    alignItems: "flex-start",
    marginBottom: 6,
    paddingHorizontal: 2,
    flexWrap: "wrap",
    textAlign: "right",
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 8,
    marginLeft: 2,
    textAlign: "right",
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 10,
    textAlign: "right",
    flexShrink: 1,
    flex: 1,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#374151",
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: "row-reverse",
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#374151",
    padding: 3,
    flex: 1,
    flexDirection: "row-reverse", // إضافة هذه
  },
  // الأعمدة العادية
  // tableCol: {
  //   borderStyle: "solid",
  //   borderWidth: 1,
  //   borderColor: "#374151",
  //   paddingVertical: 2,
  //   paddingHorizontal: 3,
  //   justifyContent: "center",
  //   flexDirection: "row-reverse",
  // },
  // ✅ تخصيص عرض الأعمدة الطويلة يدويًا (اختياري)
  tableColWide: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 2,
    paddingHorizontal: 3,
    flexGrow: 2, // أوسع
    flexShrink: 1,
    justifyContent: "center",
    flexDirection: "row-reverse",
  },
  tableColNarrow: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#374151",
    padding: 3,
    width: "8%",
    flexDirection: "row-reverse",
  },


  tableCellHeader: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "NotoSansArabic",
  },

  tableCell: {
    fontSize: 8,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "NotoSansArabic",
  },

  bottomTable: {
    display: "table",
    // width: "100%",
    marginTop: 10,
  },
  bottomTableRow: {
    flexDirection: "row-reverse",
  },
  bottomTableCol: {
    padding: 0,
    flex: 1,
  },
  bottomTableCell: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "NotoSansArabic",
  },
  //الاختاااام
  signaturesRow: {
    display: "flex",
    marginTop: 6,
    marginBottom: 20,
  },
  signaturesInnerRow: {
    flexDirection: "row-reverse",
  },
  signatureCell: {
    flex: 1,
    marginHorizontal: 3,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 9,
    fontFamily: "NotoSansArabic",
    fontWeight: "bold",
  },

  footerText: {
    textAlign: "center",
    fontFamily: "NotoSansArabic",
    fontSize: 10,
    marginVertical: 6,
    width: "100%",
    fontWeight: "bold",
  }
  ,
  footer: {
    width: "100%", // يمتد على عرض الصفحة بالكامل
    textAlign: "right", // النص على اليمين
    fontSize: 7, // حجم خط أصغر
    marginTop: 8, // مسافة بسيطة من الأعلى
    fontFamily: "NotoSansArabic",
    direction: "rtl", // تأكيد اتجاه الكتابة عربي
  },
  footerTxt: {
    textAlign: "center",
    fontFamily: "NotoSansArabic",
    fontSize: 12,
    marginTop: 14,
    width: "50%",
    fontWeight: "bold",
    borderBottomWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: -3,
  }

});

// Utility function to split array into chunks
function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

const StateDocument = ({ pdfData }) => {

  console.log("data", pdfData);
  //علشان يحط التاريخ بصورة مناسبة 
  const formatDate = (iso) => {
    // لو التاريخ مش موجود أو يساوي التاريخ الافتراضي
    if (!iso || iso === "1899-11-30T00:00:00.000Z") return "";

    const d = new Date(iso);
    // لو التاريخ غير صالح
    if (isNaN(d)) return "";

    // صيغة: يوم-شهر-سنة
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const academicChunks = chunkArray(pdfData.academics || [], 15); // المؤهلات
  const careerChunks = chunkArray(pdfData.careerProgression || [], 15); // التدرج الوظيفي
  const deputationChunks = chunkArray(pdfData.secondments || [], 15); // الإعارات
  const punishmentChunks = chunkArray(pdfData.punishments || [], 15); // الجزاءات
  const egazatChunks = chunkArray(pdfData.Egazat || [], 15); // الإجازات


  // دالة لايجاد تاريخ اليوم
  const getDateNow = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`; // النتيجة: 24-07-2025
  };

  // 💡 الجزء الجديد والمهم: دمج جميع الأجزاء المتبقية في قائمة مرتبة
  // يتم دمج الشرائح المتبقية لـ (المؤهلات والوظيفي) + جميع شرائح (الإعارات، الجزاءات، الإجازات)
  const remainingPagesContent = [
    // 1. المؤهلات العلمية (تتمة) - تبدأ من الشريحة 1
    ...academicChunks.slice(1).map((chunk, index) => ({
      type: "المؤهلات العلمية (تتمة)",
      chunk: chunk,
      originalStartIndex: 15 * (index + 1), // بداية الترقيم في هذا الـ chunk
      tableType: 'academic',
    })),

    // 2. التدرج الوظيفي (تتمة) - تبدأ من الشريحة 1
    ...careerChunks.slice(1).map((chunk, index) => ({
      type: "التدرج الوظيفي (تتمة)",
      chunk: chunk,
      originalStartIndex: 15 * (index + 1),
      tableType: 'career',
    })),

    // 3. الإعارات - تبدأ من الشريحة 0
    ...deputationChunks.map((chunk, index) => ({
      type: index === 0 ? "بيان حالة بالاعارات" : "بيان حالة بالاعارات (تتمة)",
      chunk: chunk,
      originalStartIndex: 15 * index,
      tableType: 'deputation',
    })),

    // 4. الجزاءات - تبدأ من الشريحة 0
    ...punishmentChunks.map((chunk, index) => ({
      type: index === 0 ? "بيان حالة بالجزاءات" : "بيان حالة بالجزاءات (تتمة)",
      chunk: chunk,
      originalStartIndex: 15 * index,
      tableType: 'punishment',
    })),

    // 5. الإجازات - تبدأ من الشريحة 0
    ...egazatChunks.map((chunk, index) => ({
      type: index === 0 ? "بيان حالة بالاجازات" : "بيان حالة بالاجازات (تتمة)",
      chunk: chunk,
      originalStartIndex: 15 * index,
      tableType: 'egazat',
    })),
  ].filter(item => item.chunk.length > 0); // فلترة الشرائح الفارغة


  return (
    <Document>
      {/* ------------------------------------ */}
      {/* Page 1: Header + Employee Info + First chunks of main tables */}
      {/* ------------------------------------ */}
      <Page size="A4" style={styles.page} wrap={false}>
        {/* --- Header --- */}
        <View style={styles.header}>
          {/* Right side (Arabic) */}
          <View style={styles.headerRight}>
            <Text style={styles.arabicText}>جامعة الأزهر</Text>
            <Text style={styles.arabicText}>الإدارة العامة للشؤون الإدارية</Text>
            <Text style={styles.arabicText}>إدارة الموارد البشرية</Text>
            <Text style={styles.arabicText}>وحدة تطوير وتحديث بيانات الجامعة</Text>
          </View>

          {/* Center logo */}
          <View style={styles.headerCenter}>
            <Image
              src={Logo}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
          </View>

          {/* Left side (English) */}
          <View style={styles.headerLeft}>
            <Text style={styles.englishText}>Al-Azhar University</Text>
            <Text style={styles.englishText}>
              General Administration for Administrative Affairs
            </Text>
            <Text style={styles.englishText}>Human Resources Department</Text>
            <Text style={styles.englishText}>
              University Data Development and Update Unit
            </Text>
          </View>
        </View>

        {/* --- Section: Employee Info --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> بيان حالة</Text>
          <View style={styles.employeeInfo}>
            {[
              ["الاسم", pdfData.name || ""],
              ["النوع", pdfData.gender || ""],
              ["تاريخ الميلاد", formatDate(pdfData.birthdate)],
              ["جهة الميلاد", pdfData.birthCountry || ""],
              ["المحافظة", pdfData.governorate || ""],
              ["الرقم القومي", pdfData.nationalID || ""],
              ["تاريخ إصدار الرقم القومي", formatDate(pdfData.nationalIDDate)],
              ["رقم الملف", pdfData.fileNumber || ""],
            ].map(([label, value], i) => (
              <View style={styles.infoItem} key={i}>
                <Text style={styles.infoLabel}>: {label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- Section: Academic Qualifications (first chunk) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المؤهلات العلمية</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {["م", "المؤهل", "الكلية", "اسم القسم", "الشهر", "السنة", "التقدير", "الجامعة"].map(
                (item, i) => (
                  <View
                    key={i}
                    style={i === 0 ? styles.tableColNarrow : styles.tableCol}
                  >
                    <Text style={styles.tableCellHeader}>{item}</Text>
                  </View>
                )
              )}
            </View>
            {academicChunks[0] && academicChunks[0].length > 0 ? (
              academicChunks[0].filter(row => row).map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  {[
                    i + 1,
                    row.degree || "",
                    row.faculty || "",
                    row.department || "",
                    row.month || "",
                    row.year || "",
                    row.grade || "",
                    row.university || "",
                  ].map((col, j) => (
                    <View
                      key={j}
                      style={j === 0 ? styles.tableColNarrow : styles.tableCol}
                    >
                      <Text style={styles.tableCell}>{col}</Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.tableRow,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>لا توجد بيانات</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* --- Section: Career Progression (first chunk) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التدرج الوظيفي</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {[
                "م",
                "الوظيفة",
                "القسم",
                "الكلية",
                "اعتبار من تاريخ",
                "حتى تاريخ",
                "تاريخ استلام العمل",
                "ملاحظات",
              ].map((item, i) => (
                <View
                  key={i}
                  style={i === 0 ? styles.tableColNarrow : styles.tableCol}
                >
                  <Text style={styles.tableCellHeader}>{item}</Text>
                </View>
              ))}
            </View>
            {careerChunks[0] && careerChunks[0].length > 0 ? (
              careerChunks[0].filter(row => row).map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  {[
                    i + 1,
                    row.jobTitle || "",
                    row.department || "",
                    row.faculty || "",
                    formatDate(row.dateOfOccupation) || "",
                    formatDate(row.expirationDate) || "",
                    formatDate(row.dateOfStartJob) || "",

                    row.notes || "",
                  ].map((col, j) => (
                    <View
                      key={j}
                      style={j === 0 ? styles.tableColNarrow : styles.tableCol}
                    >
                      <Text style={styles.tableCell}>{col}</Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.tableRow,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>لا توجد بيانات</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* --- Bottom Table: Current Degree (FIXED CONTENT) --- */}
        <View style={styles.bottomTable}>
          <View style={styles.bottomTableRow}>
            {["الدرجة الحالية", "القسم", "الكلية"].map((col, i) => (
              <View key={i} style={styles.bottomTableCol}>
                <Text style={styles.bottomTableCell}>{col}</Text>
              </View>
            ))}
          </View>
          <View style={styles.bottomTableRow}>
            {[
              pdfData.currentPosition?.jobTitle || pdfData.currentPosition || "",
              pdfData.currentPosition?.department || "",
              pdfData.currentPosition?.faculty || ""
            ].map((value, i) => (
              <View key={i} style={styles.bottomTableCol}>
                <Text style={styles.bottomTableCell}>{value}</Text>
              </View>
            ))}
          </View>
        </View>


        {/* --- Signatures Row (FIXED CONTENT) --- */}
        <View style={styles.signaturesRow}>
          <View style={styles.signaturesInnerRow}>
            {["مسؤول الكمبيوتر", "رئيس قسم الملفات", "مدير الموارد البشرية", "مدير عام الشؤون الإدارية"].map((text, i) => (
              <View key={i} style={styles.signatureCell}>
                <Text>{text}</Text>
              </View>
            ))}
          </View>
        </View>


        <Text style={styles.footer}>تحريراً في : {getDateNow()}</Text>
      </Page>


      {/* ------------------------------------ */}
      {/* Pages 2+ : All remaining chunks combined and ordered */}
      {/* ------------------------------------ */}
      {remainingPagesContent.map((item, pageIndex) => {
        const { type, chunk, originalStartIndex, tableType } = item;

        let headers = [];
        let getRowData = () => []; // Function to map row data

        // تحديد الهيدر ومصفوفة البيانات بناءً على نوع الجدول
        switch (tableType) {
          case 'academic':
            headers = ["م", "المؤهل", "الكلية", "اسم القسم", "الشهر", "السنة", "التقدير", "الجامعة"];
            getRowData = (row, i) => [
              originalStartIndex + i + 1,
              row.degree || "",
              row.faculty || "",
              row.department || "",
              row.month || "",
              row.year || "",
              row.grade || "",
              row.university || "",
            ];
            break;

          case 'career':
            headers = ["م", "الوظيفة", "القسم", "الكلية", "اعتبار من تاريخ", "حتى تاريخ", "تاريخ استلام العمل", "ملاحظات"];
            getRowData = (row, i) => [
              originalStartIndex + i + 1,
              row.jobTitle || "",
              row.department || "",
              row.faculty || "",
              formatDate(row.dateOfOccupation) || "",
              formatDate(row.expirationDate) || "",
              formatDate(row.dateOfStartJob) || "",
              row.notes || "",
            ];
            break;

          case 'deputation':
            headers = ["م", "نوع الإعارة", "الدولة المعار إليها", "جهة الإعارة", "تاريخ الإعارة", "حتى تاريخ", "عام التجديد", "تاريخ تسلم العمل"];
            getRowData = (row, i) => [
              originalStartIndex + i + 1,
              row.deputationType || "",
              row.deputedCountry || "",
              row.universityName || "",
              formatDate(row.deputationDate) || "",
              formatDate(row.deputationEndDate) || "",
              row.renewalYear || "",
              formatDate(row.deputationStartDate) || "",
            ];
            break;

          case 'punishment':
            headers = ["م", "أمر التنفيذ", "سبب الجزاء", "تاريخ أمر التنفيذ", "ملاحظات"];
            getRowData = (row, i) => [
              originalStartIndex + i + 1,
              row.execution_order,
              row.reasons,
              formatDate(row.execution_order_date),
              row.notes || "",
            ];
            break;

          case 'egazat':
            headers = ["م", "نوع الإجراء", "نوع الإجازة", "من تاريخ", "إلى تاريخ", "مدة الاجازة", "رقم أمر التنفيذ", "تاريخ أمر التنفيذ", "موقف السفر", "ملاحظات"];
            getRowData = (row, i) => [
              originalStartIndex + i + 1,
              row.grant_type,
              row.leave_type,
              formatDate(row.from_date),
              formatDate(row.to_date),
              row.duration_days,
              row.execution_order_number,
              formatDate(row.execution_order_date),
              row.travel_status,
              row.notes || "",
            ];
            break;

          default:
            return null;
        }
        
        // لا تعرض الصفحات التي لا تحتوي على بيانات فعلاً (تمت فلترتها مسبقاً، لكن للتأكد)
        if (chunk.length === 0) return null;


        return (
          <Page
            key={`extra-page-${pageIndex}`}
            size="A4"
            style={styles.page}
            wrap={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{type}</Text>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  {headers.map((item, i) => (
                    <View key={i} style={i === 0 ? styles.tableColNarrow : styles.tableCol}>
                      <Text style={styles.tableCellHeader}>{item}</Text>
                    </View>
                  ))}
                </View>

                {/* Table Rows */}
                {chunk.map((row, i) => {
                  const rowData = getRowData(row, i);
                  return (
                    <View style={styles.tableRow} key={i}>
                      {rowData.map((col, j) => (
                        <View key={j} style={j === 0 ? styles.tableColNarrow : styles.tableCol}>
                          <Text style={styles.tableCell}>{col}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* --- Bottom Table: Current Degree (REPEATED) --- */}
            <View style={styles.bottomTable}>
              <View style={styles.bottomTableRow}>
                {["الدرجة الحالية", "القسم", "الكلية"].map((col, i) => (
                  <View key={i} style={styles.bottomTableCol}>
                    <Text style={styles.bottomTableCell}>{col}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.bottomTableRow}>
                {[
                  pdfData.currentPosition?.jobTitle || pdfData.currentPosition || "",
                  pdfData.currentPosition?.department || "",
                  pdfData.currentPosition?.faculty || ""
                ].map((value, i) => (
                  <View key={i} style={styles.bottomTableCol}>
                    <Text style={styles.bottomTableCell}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>


            {/* --- Signatures Row (REPEATED) --- */}
            <View style={styles.signaturesRow}>
              <View style={styles.signaturesInnerRow}>
                {["مسؤول الكمبيوتر", "رئيس قسم الملفات", "مدير الموارد البشرية", "مدير عام الشؤون الإدارية"].map((text, i) => (
                  <View key={i} style={styles.signatureCell}>
                    <Text>{text}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.footer}>تحريراً في : {getDateNow()}</Text>
          </Page>
        );
      })}


    </Document>
  );
};
export default StateDocument;