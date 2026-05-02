const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { Certificate } = require("crypto");


exports.generateCertificatePDF = async ({
    studentName ,
    programName, 
    courseName,
    completionDate,
    certificateId,
    qrBase64,
    signatoryName,
    signatureImageUrl,
    logoUrl,
    institutionName,
}) => {
    const formattedDate = new Date(completionDate).toLocaleDateString("en-IN", {
        day: "numeric", 
        month: "long",
        year: "numeric"
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      background: #fff;
      width: 1122px;
      height: 794px;
      overflow: hidden;
    }
    .certificate {
      width: 1122px;
      height: 794px;
      border: 12px solid #c9a84c;
      padding: 40px 60px;
      position: relative;
      background: linear-gradient(135deg, #fffdf5 0%, #fff9e6 100%);
    }
    .inner-border {
      border: 3px solid #c9a84c;
      width: 100%;
      height: 100%;
      padding: 30px 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin-bottom: 10px;
    }
    .institution {
      font-size: 13px;
      color: #888;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .cert-title {
      font-size: 42px;
      color: #c9a84c;
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .cert-subtitle {
      font-size: 13px;
      color: #555;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .divider {
      width: 60%;
      height: 1px;
      background: #c9a84c;
      margin: 10px auto;
    }
    .presented-to {
      font-size: 13px;
      color: #888;
      margin: 14px 0 4px;
      letter-spacing: 1px;
    }
    .student-name {
      font-size: 46px;
      color: #2c2c2c;
      font-style: italic;
      margin: 4px 0 12px;
    }
    .description {
      font-size: 14px;
      color: #555;
      text-align: center;
      line-height: 1.8;
      max-width: 700px;
      margin-bottom: 16px;
    }
    .program-name {
      font-size: 20px;
      color: #c9a84c;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .completion-date {
      font-size: 13px;
      color: #777;
      margin-bottom: 20px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      margin-top: auto;
    }
    .signatory {
      text-align: center;
    }
    .signature-img {
      height: 50px;
      object-fit: contain;
      margin-bottom: 4px;
    }
    .signatory-line {
      width: 180px;
      height: 1px;
      background: #555;
      margin: 0 auto 4px;
    }
    .signatory-name {
      font-size: 12px;
      color: #555;
    }
    .qr-section {
      text-align: center;
    }
    .qr-section img {
      width: 80px;
      height: 80px;
    }
    .qr-label {
      font-size: 9px;
      color: #aaa;
      margin-top: 4px;
    }
    .cert-id {
      font-size: 9px;
      color: #bbb;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="inner-border">
      ${logoUrl ? `<img class="logo" src="${logoUrl}" />` : ""}
      <div class="institution">${institutionName || "Ethnotech Academy"}</div>
      <div class="cert-title">Certificate</div>
      <div class="cert-subtitle">OF COMPLETION</div>
      <div class="divider"></div>
      <div class="presented-to">This is to certify that</div>
      <div class="student-name">${studentName}</div>
      <div class="description">
        has successfully completed all requirements and demonstrated proficiency in
      </div>
      <div class="program-name">${programName} — ${courseName}</div>
      <div class="completion-date">Completed on ${formattedDate}</div>
      <div class="divider"></div>
      <div class="footer">
        <div class="signatory">
          ${signatureImageUrl
            ? `<img class="signature-img" src="${signatureImageUrl}" />`
            : `<div style="height:54px"></div>`}
          <div class="signatory-line"></div>
          <div class="signatory-name">${signatoryName}</div>
          <div class="signatory-name" style="color:#aaa;font-size:10px">Authorised Signatory</div>
        </div>
        <div class="qr-section">
          <img src="${qrBase64}" />
          <div class="qr-label">Scan to Verify</div>
          <div class="cert-id">${certificateId}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  
  const outputDir  = path.join(__dirname, "../uploads/certificates");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName   = `${certificateId}.pdf`;
  const outputPath = path.join(outputDir, fileName);

  await page.pdf({
    path:   outputPath,
    width:  "1122px",
    height: "794px",
    printBackground: true,
  });

  await browser.close();

  return {
    filePath: outputPath,
    fileUrl:  `/uploads/certificates/${fileName}`,
  };
}