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
    alignItems: "flex-start",
    marginBottom: 12,
    minHeight: 60,
    fontWeight: "bold",
  },
  headerRight: {
    alignItems: "center",
    flex: 1,
    textAlign: "center",
  },
  headerLeft: {
    alignItems: "center",
    flex: 1,
    textAlign: "center",
    fontFamily: "Helvetica", // English
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
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
    marginBottom: 2,
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
  },
  tableColNarrow: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#374151",
    padding: 3,
    width: "8%",
  },
  tableCell: {
    fontSize: 7,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "NotoSansArabic",
  },
  tableCellHeader: {
    fontSize: 7,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "NotoSansArabic",
  },
});

// Utility function to split array into chunks
function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

const MyDocument = ({ pdfData }) => {
  const formatDate = (iso) =>
    iso && iso !== "1899-11-30T00:00:00.000Z"
      ? new Date(iso).toLocaleDateString("en-US")
      : "";

  const academicChunks = chunkArray(pdfData.academicQualifications, 15);
  // Reverse career progression so most recent is first
  const careerChunks = chunkArray(
    [...pdfData.careerProgression].sort(
      (a, b) => new Date(b.dateOfOccupation) - new Date(a.dateOfOccupation)
    ),
    15
  );

  return (
    <Document>
      {/* First page: header, info, and first chunk of each table */}
      <Page size="A4" style={styles.page} wrap={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <Text style={styles.arabicText}>جامعة الأزهر</Text>
            <Text style={styles.arabicText}>
              الإدارة العامة للشؤون الإدارية
            </Text>
            <Text style={styles.arabicText}>إدارة الموارد البشرية</Text>
            <Text style={styles.arabicText}>
              وحدة تطوير وتحديث بيانات الجامعة
            </Text>
          </View>
          <View style={styles.headerCenter}>
            <Image
              src={Logo}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
          </View>
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

        {/* Section: Employee Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بيان حاله</Text>
          <View style={styles.employeeInfo}>
            {[
              ["الاسم", pdfData.name || ""],
              ["النوع", pdfData.gender || "ذكر"],
              ["تاريخ الميلاد", formatDate(pdfData.birthdate)],
              ["جهة الميلاد", pdfData.birthCountry || ""],
              ["العنوان", pdfData.address || ""],
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

        {/* Section: Qualifications (first chunk) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المؤهلات العلمية</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {[
                "م",
                "المؤهل",
                "الكلية",
                "اسم القسم",
                "الشهر",
                "السنة",
                "التقدير",
                "الجامعة",
              ].map((item, i) => (
                <View
                  key={i}
                  style={i === 0 ? styles.tableColNarrow : styles.tableCol}
                >
                  <Text style={styles.tableCellHeader}>{item}</Text>
                </View>
              ))}
            </View>
            {academicChunks[0] && academicChunks[0].length > 0 ? (
              academicChunks[0].map((row, i) => (
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
                <Text style={styles.tableCell}>لا توجد بيانات</Text>
              </View>
            )}
          </View>
        </View>

        {/* Section: Career Progression (first chunk) */}
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
              careerChunks[0].map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  {[
                    i + 1,
                    row.jobTitle,
                    row.department,
                    row.faculty,
                    formatDate(row.dateOfOccupation),
                    formatDate(row.expirationDateOfOccupation),
                    formatDate(row.dateOfStartJob),
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
                <Text style={styles.tableCell}>لا توجد بيانات</Text>
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Additional pages for academic qualifications */}
      {academicChunks.slice(1).map((chunk, pageIndex) => (
        <Page
          key={`academic-page-${pageIndex}`}
          size="A4"
          style={styles.page}
          wrap={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المؤهلات العلمية (تابع)</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                {[
                  "م",
                  "المؤهل",
                  "الكلية",
                  "اسم القسم",
                  "الشهر",
                  "السنة",
                  "التقدير",
                  "الجامعة",
                ].map((item, i) => (
                  <View
                    key={i}
                    style={i === 0 ? styles.tableColNarrow : styles.tableCol}
                  >
                    <Text style={styles.tableCellHeader}>{item}</Text>
                  </View>
                ))}
              </View>
              {chunk.map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  {[
                    pageIndex * 15 + i + 1,
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
              ))}
            </View>
          </View>
        </Page>
      ))}

      {/* Additional pages for career progression */}
      {careerChunks.slice(1).map((chunk, pageIndex) => (
        <Page
          key={`career-page-${pageIndex}`}
          size="A4"
          style={styles.page}
          wrap={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التدرج الوظيفي (تابع)</Text>
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
              {chunk.map((row, i) => (
                <View style={styles.tableRow} key={i}>
                  {[
                    pageIndex * 15 + i + 1,
                    row.jobTitle,
                    row.department,
                    row.faculty,
                    formatDate(row.dateOfOccupation),
                    formatDate(row.expirationDateOfOccupation),
                    formatDate(row.dateOfStartJob),
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
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MyDocument;
