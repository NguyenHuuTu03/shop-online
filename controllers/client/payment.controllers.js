const Order = require("../../models/order.model");
const User = require("../../models/users.model");

const axios = require("axios");
const crypto = require("crypto");
const https = require("https");

const { VNPay, HashAlgorithm, ProductCode } = require("vnpay");
const Cart = require("../../models/cart.model");

// [POST] /payment/momo
module.exports.paymentMomo = async (req, res) => {
  const { id, totalPrice } = req.body;
  var accessKey = "F8BBA842ECF85";
  var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var orderInfo = `Thanh toán đơn hàng ${id}`;
  var partnerCode = "MOMO";
  var redirectUrl = `https://arise-perfume-bucked.ngrok-free.dev/payment/momo-return`;
  var ipnUrl = `https://arise-perfume-bucked.ngrok-free.dev/payment/momo-return`;
  var requestType = "payWithMethod";
  var amount = Number(totalPrice);
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";
  var paymentCode =
    "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const momoReq = https.request(options, (momoRes) => {
    console.log(`Status: ${momoRes.statusCode}`);

    let data = "";

    momoRes.on("data", (chunk) => {
      data += chunk;
    });

    momoRes.on("end", () => {
      const result = JSON.parse(data);

      return res.json({
        code: 200,
        data: result,
      });
    });
  });

  momoReq.on("error", (e) => {
    console.log(`problem with request: ${e.message}`);

    return res.json({
      code: 500,
      message: e.message,
    });
  });

  momoReq.write(requestBody);
  momoReq.end();
};

// [GET] /payment/momo-return
module.exports.momoReturn = async (req, res) => {
  const { resultCode, orderInfo } = req.query;
  const orderId = orderInfo.split(" ")[4];

  if (resultCode == "0") {
    await Order.updateOne(
      { _id: orderId },
      {
        paymentStatus: "PAID",
      },
    );
    await Cart.updateOne(
      {
        _id: cart.id,
      },
      {
        products: [],
      },
    );
    return res.redirect(`/order/success/${orderId}`);
  }
  await Order.updateOne(
    { _id: orderId },
    {
      paymentStatus: "FAILED",
    },
  );
  return res.redirect(`/order/fail`);
};

// [POST] /payment/vnpay
module.exports.paymentVNPay = async (req, res) => {
  const vnpay = new VNPay({
    tmnCode: "9TWVC9IM",
    secureSecret: "PT3TGXTHDKYFU1RYW3G8CXS0D3JK8KML",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: "SHA512",
    enableLog: true,
  });
  const { orderId, amount } = req.body;

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: Number(amount),
    vnp_IpAddr: req.ip || "127.0.0.1",
    vnp_ReturnUrl: `https://arise-perfume-bucked.ngrok-free.dev/payment/vnpay-return`,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán đơn hàng #${orderId}`,
  });

  return res.json({ paymentUrl });
};

// [GET] /payment/vnpay-return
module.exports.vnpayReturn = async (req, res) => {
  const vnpay = new VNPay({
    tmnCode: "9TWVC9IM",
    secureSecret: "PT3TGXTHDKYFU1RYW3G8CXS0D3JK8KML",
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: "SHA512",
    enableLog: true,
  });
  const verify = vnpay.verifyReturnUrl(req.query);

  if (verify.isSuccess) {
    await Order.updateOne(
      { _id: req.query.vnp_TxnRef },
      {
        paymentStatus: "PAID",
      },
    );
    await Cart.updateOne(
      {
        _id: cart.id,
      },
      {
        products: [],
      },
    );
    return res.redirect(`/order/success/${req.query.vnp_TxnRef}`);
  }
  await Order.updateOne(
    { _id: req.query.vnp_TxnRef },
    {
      paymentStatus: "FAILED",
    },
  );
  return res.redirect(`/order/fail`);
};
