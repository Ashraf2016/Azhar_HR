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

console.log("LoansDocument component is loaded!");


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
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    // alignItems: "flex-start",
    marginBottom: 10,
    minHeight: 60,
    fontWeight: "bold",
    alignItems: "stretch",
  },
  headerRight: {
    alignItems: "center",
    flex: 1,
    textAlign: "center",
  },
  headerLeft: {
    alignItems: "center",
    flex: 1.1,
    textAlign: "center",
    fontFamily: "Helvetica", // English
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  arabicText: {
    fontSize: 10,
    color: "#1F2937",
    marginBottom: 0,
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
  flexDirection: "row-reverse",  // إضافة هذه
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
  marginBottom:20,
},
signaturesInnerRow: {
  flexDirection: "row-reverse",
},
signatureCell: {
  flex: 1,
  marginHorizontal:3,
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#000",
  textAlign: "center",
  fontSize: 9,
  fontFamily: "NotoSansArabic",
  fontWeight: "bold",
},

footerText:{
  textAlign: "center",
  fontFamily: "NotoSansArabic",
  fontSize: 10,
  marginVertical:6,
  width:"100%",
  fontWeight: "bold",
}
,
footer:{
  width: "100%",          // يمتد على عرض الصفحة بالكامل
  textAlign: "right",     // النص على اليمين
  fontSize: 7,            // حجم خط أصغر
  marginTop: 8,           // مسافة بسيطة من الأعلى
  fontFamily: "NotoSansArabic",
  direction: "rtl",       // تأكيد اتجاه الكتابة عربي
},
footerTxt:{
  textAlign: "center",
  fontFamily: "NotoSansArabic",
  fontSize: 12,
  marginTop:14,
  width:"50%",
  fontWeight: "bold",
  borderBottomWidth:1,
  marginLeft: "auto",
  marginRight: "auto",
  paddingBottom:-3,
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

const LoansDocument = ({ pdfData }) => {

  console.log("شش" ,pdfData)
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


  const academicChunks = chunkArray(pdfData.secondments|| [], 15);
  // Reverse career progression so most recent is first
  const careerChunks = chunkArray(
    [...pdfData.secondments].sort(
      (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
    ),
    15
  );

  //دالة لايجاد تاريخ اليوم
 const getDateNow = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`; // النتيجة: 24-07-2025
};


return (
  <Document>
    {/* ------------------------------------ */}
    {/* Page 1: Header + Employee Info + First chunks of tables */}
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
        <Text style={styles.sectionTitle}> بيان حالة بالإعارات</Text>
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
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {["م",
             "نوع الإعارة",
              "الدولة المعار إليها",
              "جهة الإعارة",
                "تاريخ الإعارة",
                 "حتى تاريخ",
                  "عام التجديد",
                   "تاريخ تسلم العمل"].map(
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
            academicChunks[0].map((row, i) => (
              <View style={styles.tableRow} key={i}>
                {[
                  i + 1,
                  row.deputationType || "",
                  row.deputedCountry || "",
                  row.universityName || "",
                  formatDate(row.deputationDate) || "",
                  formatDate(row.deputationEndDate) || "",
                  row.renewalYear || "",
                  formatDate(row.deputationStartDate) || "",
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
              <Text style={styles.tableCell}>لا توجد إعارات</Text>
            </View>
          )}
        </View>
      </View>

     
      {/* --- Bottom Table: Current Degree --- */}
    <View style={styles.bottomTable}>
      <View style={styles.bottomTableRow}>
        {["الدرجة الحالية", "القسم", "الكلية"].map((col, i) => (
          <View key={i} style={styles.bottomTableCol}>
            <Text style={styles.bottomTableCell}>{col}</Text>
          </View>
        ))}
      </View>
      <View style={styles.bottomTableRow}>
        {[pdfData.currentPosition || "", pdfData.currentPosition.department || "", pdfData.currentPosition.faculty || ""].map((value, i) => (
          <View key={i} style={styles.bottomTableCol}>
            <Text style={styles.bottomTableCell}>{value}</Text>
          </View>
        ))}
      </View>
</View>
        
      
      {/* الاختام */}
      {/* --- Signatures Row --- */}
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
    {/* Pages 2+ : Additional Academic Qualification Chunks */}
    {/* ------------------------------------ */}
    {academicChunks.slice(1).map((chunk, pageIndex) => (
      <Page
        key={`academic-page-${pageIndex}`}
        size="A4"
        style={styles.page}
        wrap={false}
      >
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {["م",
             "نوع الإعارة",
              "الدولة المعار إليها",
              "جهة الإعارة",
                "تاريخ الإعارة",
                 "حتى تاريخ",
                  "عام التجديد",
                   "تاريخ تسلم العمل"].map(
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
            {chunk.map((row, i) => (
              <View style={styles.tableRow} key={i}>
                {[
                  pageIndex * 15 + i + 1,
                  row.deputationType || "",
                  row.deputedCountry || "",
                  row.universityName || "",
                  formatDate(row.deputationDate) || "",
                  formatDate(row.deputationEndDate) || "",
                  row.renewalYear || "",
                  formatDate(row.deputationStartDate)|| "",
                ].map((col, j) => (
                  <View
                    key={j}
                    style={j === 0 ? styles.tableColNarrow : styles.tableCol}
                  >
                    <Text style={styles.tableCell}>{col}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
         {/* --- Bottom Table: Current Degree --- */}
<View style={styles.bottomTable}>
  <View style={styles.bottomTableRow}>
    {["الدرجة الحالية", "القسم", "الكلية"].map((col, i) => (
      <View key={i} style={styles.bottomTableCol}>
        <Text style={styles.bottomTableCell}>{col}</Text>
      </View>
    ))}
  </View>
        {/* <View style={styles.bottomTableRow}>
          {[pdfData.currentPosition.jobTitle || "", pdfData.currentPosition.department || "", pdfData.currentPosition.faculty || ""].map((value, i) => (
            <View key={i} style={styles.bottomTableCol}>
              <Text style={styles.bottomTableCell}>{value}</Text>
            </View>
          ))}
        </View> */}
      </View>

        
        {/* الاختام */}
        {/* --- Signatures Row --- */}
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
    ))}

    
       
      
    
  </Document>
);
};
export default LoansDocument;