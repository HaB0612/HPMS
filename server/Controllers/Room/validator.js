const Customer = require("../../models/Customer");
const Feature = require("../../models/Feature");
const Room = require("../../models/Room");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/** @namespace */
const roomValidator = {
  /** Müşterilerin varlığını kontrol eder.
   * @function customer
   * @memberof roomValidator
   * @param {array} customerID - Veritabanı müşteri ID'leri
   */
  customer: async (customerID) => {
    const isValid =
      !customerID ||
      !isValidObjectId(customerID) ||
      !(await Customer.findById(customerID));
    return validateField(
      customerID,
      isValid,
      "Lütfen geçerli bir müşteri seçin."
    );
  },
  /** Oda numarasını kontrol eder.
   * @function roomNumber
   * @memberof roomValidator
   * @param {number} roomNumber - Oda numarası
   */
  roomNumber: async (roomNumber) =>
    validateField(
      roomNumber,
      (number) => !number || !Number.isInteger(number),
      await Room.findOne({ roomNumber: roomNumber }),
      "Lütfen rakam kullanarak daha önce kaydedilmemiş bir oda numarası girin."
    ),
  /** Oda adını kontrol eder.
   * @function roomName
   * @memberof roomValidator
   * @param {string} name - Oda adı
   */
  roomName: async (name) =>
    validateField(name, (n) => !n, "Lütfen bir isim girin."),
  /** Odanın rezervasyon durumunu kontrol eder.
   * @function isReserved
   * @memberof roomValidator
   * @param {boolean} isReserved - Oda rezervasyon durumu
   */
  isReserved: async (isReserved) =>
    validateField(
      isReserved,
      (reserved) => !reserved || typeof reserved !== "boolean",
      "Lütfen rezervasyonu evet veya hayır olarak girin."
    ),
  /** Odanın kapasitesini kontrol eder.
   * @function capacity
   * @memberof roomValidator
   * @param {number} capacity - Oda kapasitesi
   */
  capacity: async (capacity) =>
    validateField(
      capacity,
      (cap) => !cap || !Number.isInteger(cap),
      "Lütfen rakam kullanarak kapasite girin."
    ),
  /** Odanın ücretini kontrol eder.
   * @function price
   * @memberof roomValidator
   * @param {number} price - Gecelik oda ücreti
   */
  price: async (price) =>
    validateField(
      price,
      (p) => !p || !Number.isInteger(p),
      "Lütfen rakam kullanarak fiyat girin."
    ),
  /** Odanın açıklamasını kontrol eder.
   * @function description
   * @memberof roomValidator
   * @param {string} description - Oda açıklması
   */
  description: async (description) =>
    validateField(description, (desc) => !desc, "Lütfen bir açıklama girin."),
  /** Yetişkin sayısının doğruluğunu kontrol eder.
   * @function adults
   * @memberof roomValidator
   * @param {number} adults - Konaklayacak yetişkin sayısı
   */
  adults: async (adults) =>
    validateField(
      adults,
      (a) => !a || !Number.isInteger(a),
      "Lütfen yetişkin sayısını girin."
    ),
  /** Çocuk sayısının doğruluğunu kontrol eder.
   * @function childs
   * @memberof roomValidator
   * @param {number} childs - Konaklayacak çocuk sayısı
   */
  childs: async (childs) =>
    validateField(
      childs,
      (c) => !c || !Number.isInteger(c),
      "Lütfen çocuk sayısını girin."
    ),
    /** Özellikleri kontrol eder.
   * @function features 
   * @memberof roomValidator
   * @param {array} features - Özelliklerin ID'leri
   */
  features: async (features) => {
    let errorCount = 0;
    for (let featureID of features) {
      if (
        !featureID ||
        !isValidObjectId(featureID) ||
        !(await Feature.findById(featureID))
      ) {
        errorCount++;
      }
    }
    return errorCount > 0 ? "Lütfen geçerli bir özellik girin." : false;
  },
};
