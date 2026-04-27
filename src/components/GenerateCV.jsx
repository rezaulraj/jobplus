import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { FiDownload } from "react-icons/fi";

const imageToBase64 = async (url) => {
  try {
    if (!url) return null;

    const pdfSafeUrl = url.includes("/image/upload/")
      ? url.replace("/image/upload/", "/image/upload/f_jpg,q_auto/")
      : url;

    const res = await fetch(pdfSafeUrl);
    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.log("PDF image convert failed:", error);
    return null;
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    gap: 18,
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#ecfdf5",
    border: "1 solid #a7f3d0",
    marginBottom: 16,
  },
  photo: {
    width: 86,
    height: 86,
    borderRadius: 43,
    objectFit: "cover",
    border: "3 solid #10b981",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#064e3b",
    marginBottom: 4,
  },
  role: {
    fontSize: 11,
    color: "#047857",
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#065f46",
    marginBottom: 7,
    paddingBottom: 4,
    borderBottom: "1 solid #d1fae5",
  },
  text: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
  },
  item: {
    marginBottom: 9,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
  },
  muted: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    padding: "4 8",
    borderRadius: 20,
    backgroundColor: "#ecfdf5",
    color: "#047857",
    fontSize: 9,
    border: "1 solid #a7f3d0",
  },
  twoCol: {
    flexDirection: "row",
    gap: 16,
  },
  col: {
    flex: 1,
  },
});

const safe = (v, fallback = "Not provided") => v || fallback;

const dateRange = (item) => {
  const start = [item?.startMonth, item?.startYear].filter(Boolean).join("/");
  const end = item?.isCurrent
    ? "Present"
    : [item?.endMonth, item?.endYear].filter(Boolean).join("/");

  return [start, end].filter(Boolean).join(" - ");
};

const GenerateCVDocument = ({ profile = {}, user = {} }) => {
  const info = profile.personalInfo || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {profile?.profileImage ? (
            <Image src={profile.profileImage} style={styles.photo} />
          ) : null}

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {safe(info.name || user.fullName, "Your Name")}
            </Text>

            <Text style={styles.role}>
              {safe(info.careerLevel, "Professional Candidate")}
            </Text>

            <Text style={styles.contact}>
              Email: {safe(info.email || user.email)}
              {"\n"}
              Phone: {safe(info.mobile)}
              {"\n"}
              Location:{" "}
              {[info.city, info.country].filter(Boolean).join(", ") ||
                "Not provided"}
              {"\n"}
              Nationality: {safe(info.nationality)}
            </Text>
          </View>
        </View>

        {profile.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{profile.summary}</Text>
          </View>
        ) : null}

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Details</Text>

              <Text style={styles.text}>
                Father Name: {safe(info.fatherName)}
              </Text>

              <Text style={styles.text}>
                Date of Birth:{" "}
                {[info.dob?.day, info.dob?.month, info.dob?.year]
                  .filter(Boolean)
                  .join(" ") || "Not provided"}
              </Text>

              <Text style={styles.text}>Gender: {safe(info.gender)}</Text>

              <Text style={styles.text}>
                Marital Status: {safe(info.maritalStatus)}
              </Text>

              <Text style={styles.text}>
                Experience: {safe(info.experience)}
              </Text>

              <Text style={styles.text}>
                Expected Salary:{" "}
                {info.expectedSalary
                  ? `${Number(info.expectedSalary).toLocaleString()} BDT / month`
                  : "Not provided"}
              </Text>
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>

              <View style={styles.chips}>
                {(profile.skills || []).length ? (
                  profile.skills.map((s, i) => (
                    <Text key={i} style={styles.chip}>
                      {s.skill} · {s.proficiency}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.text}>No skills added</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {(profile.experiences || []).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>

            {profile.experiences.map((e, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>
                  {e.jobTitle} — {e.company}
                </Text>

                <Text style={styles.muted}>{dateRange(e)}</Text>

                {e.description ? (
                  <Text style={styles.text}>{e.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {(profile.education || []).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>

            {profile.education.map((e, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{e.degree || "Degree"}</Text>

                <Text style={styles.muted}>
                  {e.institute} {e.field ? `· ${e.field}` : ""}
                </Text>

                {e.grade ? (
                  <Text style={styles.text}>Grade: {e.grade}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {(profile.projects || []).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>

            {profile.projects.map((p, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{p.title}</Text>

                {p.techStack?.length ? (
                  <Text style={styles.muted}>{p.techStack.join(", ")}</Text>
                ) : null}

                {p.description ? (
                  <Text style={styles.text}>{p.description}</Text>
                ) : null}

                {p.liveUrl ? (
                  <Text style={styles.text}>Live: {p.liveUrl}</Text>
                ) : null}

                {p.repoUrl ? (
                  <Text style={styles.text}>Repo: {p.repoUrl}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {(profile.languages || []).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>

            <View style={styles.chips}>
              {profile.languages.map((l, i) => (
                <Text key={i} style={styles.chip}>
                  {l.language} · {l.proficiency}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {info.postalAddress ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.text}>{info.postalAddress}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};

const GenerateCV = ({ profile = {}, user = {} }) => {
  const [pdfImage, setPdfImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const convertProfileImage = async () => {
      if (!profile?.profileImage) {
        setPdfImage(null);
        return;
      }

      setImageLoading(true);

      const base64Image = await imageToBase64(profile.profileImage);

      if (mounted) {
        setPdfImage(base64Image);
        setImageLoading(false);
      }
    };

    convertProfileImage();

    return () => {
      mounted = false;
    };
  }, [profile?.profileImage]);

  const cvProfile = {
    ...profile,
    profileImage: pdfImage,
  };

  const fileName =
    `${profile?.personalInfo?.name || user?.fullName || "my"}-cv.pdf`
      .replace(/\s+/g, "-")
      .toLowerCase();

  return (
    <PDFDownloadLink
      document={<GenerateCVDocument profile={cvProfile} user={user} />}
      fileName={fileName}
      className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all text-sm shadow-sm shadow-emerald-200"
    >
      {({ loading }) => (
        <>
          <FiDownload size={15} />
          {loading || imageLoading ? "Preparing CV..." : "Download CV"}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default GenerateCV;
