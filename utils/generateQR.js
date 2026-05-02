const QRCode = require("qrcode");

exports.generateQRCode = async (certificateId) => {
    const verifyUrl = `${process.env.APP_URL}/verify/${certificateId}`;
    const qrBase64 = await QRCode.toDataURL(verifyUrl, {
        widht: 200,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#ffffff"
        }
    });

    return {qrBase64 , verifyUrl};
};

