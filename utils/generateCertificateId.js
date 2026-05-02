const { v4: uuidv4} = require("uuid");


exports.generateCertificateId = () => {
    const year = new Date().getFullYear();
    const unique = uuidv4().replace(/-/g, "").substring( 0, 6).toUpperCase();
    return `CERT-${year}-${unique}`;
}