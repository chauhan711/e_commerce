class stripeStatus {
    constructor(){
        this.success = 'succeeded';
        this.needs_response = 'needs_response';
    }
}
const StripeStatus = new stripeStatus();

module.exports = StripeStatus;