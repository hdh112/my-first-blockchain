const PubNub = require('pubnub');

// For other users: create your own keyset on PubNub
const credentials = {
    publishKey: 'dummy-publish-key',
    subscribeKey: 'dummy-subscribe-key',
    secretKey: 'dummy-secret-key'
};

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            }
        }
    }

    // TODO: publish message on multiple channels
    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}

module.exports = PubSub;