class paymentStatus {
    constructor(){
        this.RECEIVED = 'RECEIVED';    
        this.REFUNDED = 'REFUNDED';
        this.CARD_ERROR = 'card_error';
    }
}
const PaymentStatus = new paymentStatus();

module.exports = PaymentStatus;